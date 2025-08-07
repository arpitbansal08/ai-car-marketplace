import { google } from "@ai-sdk/google";
import { generateText, LanguageModel, zodSchema } from "ai";
import "server-only";
import { getAllCars } from "./actions/cars-action";
import { generateCarPrompt, searchCarPrompt } from "./prompts";
import { addCarSchema } from "./zod";

class AIService {
  private model: LanguageModel;
  private searchModel: LanguageModel;
  constructor() {
    this.model = google("gemini-2.0-flash");
    // use search grounding
    this.searchModel = google("gemini-2.0-flash");
  }
  // generativeAI = async (text: string) => {};

  generateCarAgent = async (carName: string) => {
    const modifiedScehma = zodSchema(addCarSchema).jsonSchema;
    // console.log("modifiedScehma", modifiedScehma);
    const { text: res }: { text: string } = await generateText({
      model: this.searchModel,
      messages: [
        {
          role: "assistant",
          content: generateCarPrompt,
        },
        {
          role: "assistant",
          content: `The zod schema for the car is ${JSON.stringify(
            modifiedScehma
          )}`,
        },
        {
          role: "user",
          content: `The car name is ${carName}`,
        },
      ],
      tools: { google_search: google.tools.googleSearch({}) },
    });
    return res;
  };
  searchAgent = async (carDescription: string) => {
    const cars = await getAllCars();
    const carList = cars.map((car) => ({
      id: car.id,
      name: car.name,
      description: car.description,
      images: car.images[0],
      year: car.year,
      mileage: car.mileage,
      price: car.price,
      brand: car.brand,
      type: car.type,
      fuelType: car.fuelType,
      transmission: car.transmission,
      location: car.location,
      features: car.features,
      colors: car.colors,
      carType: car.type,
    }));

    const transformedCars = JSON.stringify(carList);

    const { text: res }: { text: string } = await generateText({
      model: this.searchModel,
      messages: [
        {
          role: "assistant",
          content: searchCarPrompt,
        },
        {
          role: "assistant",
          content: `Here is the list of cars available: ${transformedCars}`,
        },
        {
          role: "user",
          content: `The car description is ${carDescription}`,
        },
      ],
    });
    return res;
  };
}

export const aiService = new AIService();
