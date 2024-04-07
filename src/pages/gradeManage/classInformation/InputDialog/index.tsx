import { addClasses, updateClasses } from "@/services/api/classes";
import { waitTime } from "@/utils/request";
import { ModalForm, ProForm, ProFormInstance, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";
import { useEffect, useRef } from "react";


interface InputDialogProps {
    detailData?: API.ClassesDTO;
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
        const { classid, classname, teachername, teacherphone, position, number } = values;
        const data: API.ClassesDTO = {
            id: props.detailData?.id,
            classid,
            classname,
            teachername,
            teacherphone,
            position,
            number,
        };

        try {
            if (props.detailData) {
                await updateClasses(data, { throwError: true });
            } else {
                await addClasses(data, { throwError: true });
            }
        } catch (ex) {
            return true;
        }

        props.onClose(true);
        message.success('保存成功');
        return true;
    };

    return (
        <ModalForm
            width={600}
            onFinish={onFinish}
            formRef={form}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => props.onClose(false),
            }}
            title={props.detailData ? '修改班级信息' : '新建班级信息'}
            open={props.visible}
        >
            <ProForm.Group>
                <ProFormText
                    name="classid"
                    label="班级号"
                    rules={[
                        {
                            required: true,
                            message: '请输入班级号！',
                        },
                        {
                            pattern: /^(?:[1-9]\d*|0)?(?:\.\d+)?$/,
                            message: '请输入正确的班级号!',
                        },
                    ]}
                />
                
                <ProFormText
                    name="classname"
                    label="班级名称"
                    rules={[
                        {
                            required: true,
                            message: '请输入班级名称!',
                        },
                    ]}
                />
            </ProForm.Group>

            <ProForm.Group>
                <ProFormText
                    name="teachername"
                    label="班主任姓名"
                    rules={[
                        {
                            required: true,
                            message: '请输入班主任姓名!',
                        },
                    ]}
                />
                <ProFormText
                    name="teacherphone"
                    label="班主任电话"
                    rules={[
                        {
                            required: true,
                            message: '请输入班主任电话!',
                        },
                    ]}
                />
            </ProForm.Group>
            <ProForm.Group>
                <ProFormText
                    name="position"
                    label="班级位置"
                    placeholder='选填'
                    rules={[
                        {
                            required: false,
                            message: '请输入班级位置(选填)',
                        },
                    ]}
                />
                <ProFormText
                    name="number"
                    label="班级人数"
                    rules={[
                        {
                            required: true,
                            message: '请输入班级人数!',
                        },
                    ]}
                />
            </ProForm.Group>
        </ModalForm>
    );
}
