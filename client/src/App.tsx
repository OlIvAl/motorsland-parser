import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import {
  createUploadingDocument,
  deleteDocument,
  downloadDocument,
  getDocumentsInfo,
  getNewItemsCount,
} from "./handles";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { IDocumentInfo } from "./interfaces";
import { CustomTableRow } from "./components/CustomTableRow";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [deletedName, setDeletedName] = useState<string>("");
  const [documents, setDocuments] = useState<IDocumentInfo[]>([]);
  const [newItemsCount, setNewItemsCount] = useState<number>(0);

  useEffect((): void => {
    (async function anyNameFunction(): Promise<void> {
      setLoading(true);

      const [documentsResult, newItemsCountResult] = await Promise.all([
        getDocumentsInfo(),
        getNewItemsCount(),
      ]);
      setDocuments(documentsResult);
      setNewItemsCount(newItemsCountResult);

      setLoading(false);
    })();
  }, []);

  const deleteHandler = async (name: string): Promise<void> => {
    setLoading(true);

    const result = await deleteDocument(name);

    setDocuments(result);

    setLoading(false);
  };

  const createUploadingDocumentHandler = async (): Promise<void> => {
    setLoading(true);

    const result = await createUploadingDocument();

    setDocuments(result);

    setLoading(false);
  };

  return (
    <Container maxWidth="lg" className="App">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h4" gutterBottom component="div">
        Список выгрузок с сайта www.motorlandby.ru
      </Typography>
      {documents.length ? (
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Дата создания</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((document) => (
                <CustomTableRow
                  document={document}
                  downloadCb={downloadDocument}
                  deleteCb={() => setDeletedName(document.name)}
                  key={document.name}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" gutterBottom component="div">
          Не создано ни одной выгрузки
        </Typography>
      )}

      <div>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 16 }}
          onClick={createUploadingDocumentHandler}
        >
          Создать выгрузку
        </Button>
        <Typography gutterBottom component="div">
          {newItemsCount} новых объявлений появилось со времени последней
          выгрузки
        </Typography>
      </div>

      <ConfirmDialog
        name={deletedName}
        close={() => setDeletedName("")}
        handler={deleteHandler}
      />
    </Container>
  );
}

export default App;
