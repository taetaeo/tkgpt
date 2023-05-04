import React from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import userApis from "lib/api/modules/user.api";
import { Box, Button, Stack, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const SignUp = () => {
  const navigation = useNavigate();
  const [isRequest, setIsRequest] = React.useState(false);

  const form = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .required("아이디 또는 사용자 이름은 필수 입력 사항입니다.")
        .min(6)
        .max(15),
      password: yup
        .string()
        .required("비밀 번호는 필수 입력 사항입니다.")
        .min(8),
      confirmPassword: yup
        .string()
        .required("비밀번호 확인은 필수 입니다.")
        .min(8)
        .oneOf([yup.ref("password")], "비밀번호가 맞지 않습니다."),
    }),
    onSubmit: (values) => onSignUp(values),
  });

  const onSignUp = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    if (isRequest) return; // 요청중일때 종료
    setIsRequest(true);
    const { response, error } = await userApis.signup({ username, password });
    setIsRequest(false);

    if (response) {
      toast.success("회원가입이 성공하였습니다.");
      navigation("/signin");
    }
    if (error) toast.error(error.message);
  };
  return (
    <Box component="form" noValidate onSubmit={form.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          placeholder="username"
          name="username"
          value={form.values.username}
          onChange={form.handleChange}
          error={form.touched.username && form.errors.username != undefined}
          helperText={form.touched.username && form.errors.username}
        />
        <TextField
          fullWidth
          type="password"
          placeholder="password"
          name="password"
          value={form.values.password}
          onChange={form.handleChange}
          error={form.touched.password && form.errors.password != undefined}
          helperText={form.touched.password && form.errors.password}
        />
        <TextField
          fullWidth
          type="password"
          placeholder="Confirm password"
          name="confirmPassword"
          value={form.values.confirmPassword}
          onChange={form.handleChange}
          error={
            form.touched.confirmPassword &&
            form.errors.confirmPassword != undefined
          }
          helperText={
            form.touched.confirmPassword && form.errors.confirmPassword
          }
        />
        <LoadingButton
          type="submit"
          size="large"
          variant="contained"
          loading={isRequest}
          color="success"
        >
          회원가입
        </LoadingButton>
        <Button component={Link} to="/signin" size="small">
          로그인
        </Button>
      </Stack>
    </Box>
  );
};

export default SignUp;