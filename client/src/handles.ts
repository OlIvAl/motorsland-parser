import { IDocumentInfo } from "./interfaces";

export const getDocumentsInfo = async (): Promise<IDocumentInfo[]> => {
  const resp = await fetch("http://localhost:3001/documents");

  return (await resp.json()).documents;
};
export const getNewItemsCount = async (): Promise<number> => {
  const resp = await fetch("http://localhost:3001/items/count");

  return (await resp.json()).newItemsCount;
};
export const getPublicUrl = async (name: string): Promise<string> => {
  const resp = await fetch(`http://localhost:3001/documents/${name}/url`);

  return (await resp.json()).publicUrl;
};
export const downloadDocument = async (name: string): Promise<void> => {
  const response = await fetch(`http://localhost:3001/documents/${name}`);
  const buffer = await response.blob();

  const a = document.createElement("a");
  a.download = name + ".xml";
  a.href = URL.createObjectURL(buffer);
  a.addEventListener("click", (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  a.click();
};
export const deleteDocument = async (
  name: string
): Promise<IDocumentInfo[]> => {
  const resp = await fetch(`http://localhost:3001/documents/${name}`, {
    method: "DELETE",
  });

  return (await resp.json()).documents;
};
export const createUploadingDocument = async (): Promise<IDocumentInfo[]> => {
  const resp = await fetch(`http://localhost:3001/documents`, {
    method: "POST",
  });

  return (await resp.json()).documents;
};
