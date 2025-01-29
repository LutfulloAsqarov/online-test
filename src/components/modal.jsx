import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    display:'flex',
    flexDirection:"column",
    gap:2,
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function ResultModal({ result, refresh }) {
    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);

    return (
        <div>
            {/* <Button onClick={handleOpen}>Open modal</Button> */}
            <Modal
                open={result}
                // onClose={}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        {result?.results.map((el, inx) => (
                            <Box
                                minWidth={{ xs: 40, md: 50 }}
                                minHeight={{ xs: 40, md: 50 }}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "50%",
                                    fontWeight: "bold",
                                    fontSize: 20,
                                    color: "white",
                                    bgcolor: el ? "primary.main" : "error.main",
                                }}
                            >
                                {inx + 1}
                            </Box>
                        ))}
                    </Box>
                    <Typography variant="h6" component="h2">
                        Togri javoblar soni: <span>{result?.correct}</span>
                    </Typography>
                    <Typography variant="h6" component="h2">
                        Xato javoblar soni <span>{result?.incorrect}</span>
                    </Typography>

                    <Button onClick={refresh} variant="contained">
                        Yangi Test
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
