
export const imageKitAuthenticator = async () => {
  try {
    const response = await fetch("/api/upload-auth");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }
    const data = await response.json();
    const { signature, token, expire, publicKey } = data;
    return {
      signature,
      token,
      expire,
      publicKey,
    };
  } catch (error) {
    console.error("Error authenticating with ImageKit:", error);
    throw new Error("Failed to authenticate with ImageKit");
  }
};
