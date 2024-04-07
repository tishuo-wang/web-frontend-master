import { addGrade, updateGrade } from "@/services/api/grade";
import { waitTime } from "@/utils/request";
import { ModalForm, ProForm, ProFormInstance, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";
import { useEffect, useRef } from "react";


interface InputDialogProps {
    detailData?: API.GradeDTO;
    disable: boolean;
    visible: boolean;
    onClose: (result: boolean) => void;
}


export default function InputDialog(props: InputDialogProps) {
    const form = useRef<ProFormInstance>(null);

    useEffect(() => {
        waitTime().then(() => {
            if (props.detailData) {
                form?.current?.setFieldsValue(props.detailData);
            } else {
                form?.current?.resetFields();
            }
        });
    }, [props.detailData, props.visible]);

    const onFinish = async (values: any) => {
        const { name, userCode, classid, chineseGrade, mathGrade, englishGrade, recordtime, academicyear, term } = values;
        const data: API.GradeDTO = {
            id: props.detailData?.id,
            name,
            userCode,
            classid,
            chineseGrade,
            mathGrade,
            englishGrade,
            recordtime,
            academicyear,
            term,
        };

        try {
            if (props.detailData?.englishGrade) {
                await updateGrade(data, { throwError: true });
            } else {
                await addGrade(data, { throwError: true });
            }
        } catch (ex) {
            return true;
        }

        props.onClose(true);
        message.success('保存成功');
        return true;
    };

    const today = new Date().toLocaleDateString();

    return (
        <ModalForm
            width={600}
            onFinish={onFinish}
            formRef={form}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => props.onClose(false),
            }}
            title={props.detailData?.chineseGrade ? '修改成绩信息' : '新建成绩信息'}
            open={props.visible}
        >
            <ProForm.Group>
                <ProFormText
                    name="name"
                    label="学生姓名"
                    disabled={props.disable}
                    rules={[
                        {
                            required: true,
                            message: '请输入学生姓名！',
                        },
                    ]}
                />
                <ProFormText
                    name="classid"
                    label="班级号"
                    disabled={props.disable}
                    rules={[
                        {
                            required: true,
                            message: '请输入班级号!',
                        },
                        {
                            pattern: /^(?:[1-9]\d*|0)?(?:\.\d+)?$/,
                            message: '请输入正确的班级号!',
                        },
                    ]}
                />
            </ProForm.Group>
            <ProFormText
                name="userCode"
                label="学号"
                disabled={props.disable}
                rules={[
                    {
                        required: true,
                        message: '请输入学号!',
                    },
                ]}
            />
            <ProForm.Group>
                <ProFormText
                    name="chineseGrade"
                    label="语文成绩"
                    rules={[
                        {
                            required: true,
                            message: '请输入语文成绩!',
                        },
                        {
                            // 使用正则表达式验证是否为数字
                            pattern: /^(?:[1-9]\d*|0)?(?:\.\d+)?$/,
                            message: '请输入正确的数字!',
                        },
                    ]}
                />
                <ProFormText
                    name="mathGrade"
                    label="数学成绩"
                    rules={[
                        {
                            required: true,
                            message: '请输入数学成绩!',
                        },
                        {
                            pattern: /^(?:[1-9]\d*|0)?(?:\.\d+)?$/,
                            message: '请输入正确的数字!',
                        },
                    ]}
                />

            </ProForm.Group>
            <ProForm.Group>
                <ProFormText
                    name="englishGrade"
                    label="英语成绩"
                    rules={[
                        {
                            required: true,
                            message: '请输入英语成绩!',
                        },
                        {
                            pattern: /^(?:[1-9]\d*|0)?(?:\.\d+)?$/,
                            message: '请输入正确的数字!',
                        },
                    ]}
                />
                <ProFormText
                    name="recordtime"
                    label="录入时间"
                    initialValue={today}
                    // disabled={true}
                    rules={[
                        {
                            required: true,
                            message: '请输入录入时间(如2024/3/19)!',
                        },
                    ]}
                />
            </ProForm.Group>

            <ProForm.Group>
                <ProFormText
                    name="academicyear"
                    label="学年"
                    rules={[
                        {
                            required: true,
                            message: '请输入学年!',
                        },
                    ]}
                />
                <ProFormText
                    name="term"
                    label="学期"
                    rules={[
                        {
                            required: true,
                            message: '请输入学期!',
                        },
                    ]}
                />
            </ProForm.Group>
        </ModalForm>
    );
}
