import { UPLOAD_FILE } from "../endPoints";
import { postRequest } from "../http-client/axiosClient";
import { IMAGE_URL } from "../constants";

export const uploadFile = async (
  file: File,
  
): Promise<{ file: string; url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await postRequest(`${UPLOAD_FILE.UPLOAD}`, formData);
  const files = response?.data?.data?.files;

  if (!files || files.length === 0) {
    throw new Error("No file uploaded");
  }

  const uploadedFile = files[0];
  const filePath = uploadedFile.s3Key || uploadedFile.url || uploadedFile.name;

  const url = uploadedFile.url || `${IMAGE_URL}/${filePath}`;

  return { file: filePath, url };
};
