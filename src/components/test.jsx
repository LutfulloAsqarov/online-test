import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    Checkbox,
    Button,
    Box,
    Stack,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import ResultModal from "./modal";

const TestComponent = () => {
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [data, setData] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const onGetTest = () => {
        fetch("https://online-test-bg1l.onrender.com/api/test") // API'ga GET so‘rov yuborish
            .then((response) => response.json()) // JSON formatga o‘tkazish
            .then((json) => setData(json)) // Ma’lumotlarni state-ga saqlash
            .catch((error) => console.error("Xatolik yuz berdi:", error));
    };
    useEffect(() => {
        setLoading(true)
        onGetTest();
        setLoading(false)
    }, []);

    const handleChange = (questionIndex, optionIndex, multiple, questionId) => {
        setAnswers((prev) => {
            const prevAnswers = prev[questionIndex]?.option || []; // Agar mavjud bo‘lmasa, bo‘sh array oladi

            if (multiple) {
                const newAnswers = prevAnswers.includes(optionIndex)
                    ? prevAnswers.filter((o) => o !== optionIndex) // Agar mavjud bo‘lsa, o‘chiradi
                    : [...prevAnswers, optionIndex]; // Aks holda, qo‘shadi

                return {
                    ...prev,
                    [questionIndex]:
                        newAnswers.length > 0
                            ? { id: questionId, option: newAnswers }
                            : undefined, // Agar tanlov bo‘sh bo‘lsa, o‘chirib tashlaydi
                };
            } else {
                return {
                    ...prev,
                    [questionIndex]: { id: questionId, option: [optionIndex] }, // Faqat bitta variantni saqlaydi
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ❗ Barcha savollarga javob berilganligini tekshiramiz
        const unansweredQuestions = data?.questions.filter(
            (_, index) => !answers[index]
        );

        if (unansweredQuestions.length > 0) {
            alert("Iltimos, barcha savollarga javob bering!");
            return; // ❌ Submit bo‘lmaydi
        }

        const formattedAnswers = {
            id: data?.id,
            answers: Object.values(answers),
        };

        console.log("Submitted Answers:", formattedAnswers);

        setLoading(true);
        try {
            const response = await fetch(
                "https://online-test-bg1l.onrender.com/api/test/check-answers",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formattedAnswers),
                }
            );

            const resultTest = await response.json();
            console.log("Yuborildi:", resultTest);

            if (response.ok) {
                setResult(resultTest);
            } else {
                alert("Xatolik yuz berdi: " + resultTest.message);
            }
        } catch (error) {
            console.error("Yuborishda xatolik:", error);
            alert("Server bilan bog‘lanishda xatolik yuz berdi.");
        } finally {
            setLoading(false);
        }
    };


    const handleQuestionChange = (index) => {
        setCurrentQuestion(index);
    };

    return (
        <>
            <Container maxWidth={{ xs: "sm", md: "lg" }} sx={{ px: "16px" }}>
                <Stack direction={"row"} spacing={3}>
                    {/* Sidebar */}
                    <Box
                        sx={{
                            borderRight: "1px solid #eee",
                            pr: { xs: 2, md: 1 },
                            py: 3,
                            position: "sticky",
                            top: 0,
                            left: 0,
                            height: "100vh",
                            width: { xs: 60, md: 400 },
                            overflowY: "scroll",
                            "&::-webkit-scrollbar": {
                                display: "none", // Scrollni yashiradi
                            },
                            "-ms-overflow-style": "none", // IE va Edge uchun
                            "scrollbar-width": "none", // Firefox uchun
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                display: {
                                    xs: "none",
                                    md: "block",
                                },
                            }}
                            gutterBottom
                        >
                            Questions
                        </Typography>
                        <Stack direction={"column"} spacing={1}>
                            {data?.questions.map((q, index) => (
                                <Box
                                    component={"a"}
                                    href={`#${q.id}`}
                                    key={index}
                                    sx={{
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleQuestionChange(index)}
                                >
                                    <Stack
                                        direction={"row"}
                                        gap={2}
                                        justifyContent={"start"}
                                        alignItems={"center"}
                                    >
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
                                                color: answers[index]
                                                    ? "white"
                                                    : "black",
                                                bgcolor: answers[index]
                                                    ? "primary.main"
                                                    : "#eee",
                                            }}
                                        >
                                            {index + 1}
                                        </Box>
                                        <Typography
                                            variant="body1"
                                            display={{ xs: "none" }}
                                            sx={{
                                                display: {
                                                    xs: "none",
                                                    sm: "-webkit-box",
                                                },
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                WebkitLineClamp: 1, // Bu yerda bir qatorda cheklab qo‘yamiz
                                            }}
                                        >
                                            {q.question}
                                        </Typography>
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    {/* Main content */}

                    <Box pt={3} pb={10} width={"100%"}>
                        <Typography variant="h5" gutterBottom>
                            Test Questions
                        </Typography>

                        <form>
                            {data?.questions.map((q, index) => (
                                <FormControl
                                    component="fieldset"
                                    key={q.id}
                                    style={{
                                        paddingTop: 18,
                                        width: "100%",
                                    }}
                                    id={q.id}
                                >
                                    <Typography variant="h6">
                                        {index + 1}. {q.question}
                                    </Typography>

                                    {q.multiple ? (
                                        q.options.map((option, idx) => (
                                            <FormControlLabel
                                                key={idx}
                                                control={
                                                    <Checkbox
                                                        checked={
                                                            answers[
                                                                index
                                                            ]?.option?.includes(
                                                                idx
                                                            ) || false
                                                        }
                                                        onChange={() =>
                                                            handleChange(
                                                                index,
                                                                idx,
                                                                q.multiple,
                                                                q.id
                                                            )
                                                        }
                                                    />
                                                }
                                                label={option}
                                            />
                                        ))
                                    ) : (
                                        <RadioGroup
                                            value={
                                                answers[index]?.option?.[0] ??
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    Number(e.target.value),
                                                    q.multiple,
                                                    q.id
                                                )
                                            }
                                        >
                                            {q.options.map((option, idx) => (
                                                <FormControlLabel
                                                    key={idx}
                                                    value={idx}
                                                    control={<Radio />}
                                                    label={option}
                                                />
                                            ))}
                                        </RadioGroup>
                                    )}
                                </FormControl>
                            ))}

                         
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{mt:3}}
                                disabled={data?.questions.some(
                                    (_, index) => !answers[index]
                                )}
                            >
                                Submit
                            </Button>
                        </form>
                    </Box>
                </Stack>
            </Container>
            {/* {loading && ( */}
            <Backdrop
                sx={(theme) => ({
                    color: "#fff",
                    zIndex: theme.zIndex.drawer + 1,
                })}
                open={loading}
                // onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* )} */}
            <ResultModal
                result={result}
                refresh={() => {
                    setResult(null), onGetTest(), setAnswers({});
                }}
                // setOpen={result}
            />
        </>
    );
};

export default TestComponent;
