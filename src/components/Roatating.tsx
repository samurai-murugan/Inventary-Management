import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";


interface ViewDialogProps {
  Open: boolean;
}


export default function SimpleBackdrop({ Open }: ViewDialogProps) {
  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={Open}
      >
        <CircularProgress />
      </Backdrop>
    </div>
  );
}