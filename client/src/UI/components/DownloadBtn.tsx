import { FC, useState } from "react";
import { LoadingButton } from "@mui/lab";

interface IProps {
  url: string;
  name: string;
}

const downloadHandler = async (url: string, name: string): Promise<void> => {
  const response = await fetch(url);
  const buffer = await response.blob();

  const a = document.createElement("a");
  a.download = name;
  a.href = URL.createObjectURL(buffer);
  a.addEventListener("click", (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  a.click();
};

export const DownloadBtn: FC<IProps> = ({ url, name }) => {
  const [loading, setLoading] = useState(false);

  const onClick = () => {
    Promise.resolve()
      .then(() => setLoading(true))
      .then(() => downloadHandler(url, name))
      .finally(() => setLoading(false));
  };

  return (
    <LoadingButton
      loading={loading}
      onClick={onClick}
      variant="contained"
      color="secondary"
    >
      Скачать документ
    </LoadingButton>
  );
};
