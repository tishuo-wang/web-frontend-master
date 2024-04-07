

import { getStudent, updateStudent } from '@/services/api/student';
import { PageContainer, ProForm, ProFormText, ProFormInstance, ProFormSelect } from '@ant-design/pro-components';
import { history, useSearchParams } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useState, useRef } from 'react';


export default () => {
    const [searchParams] = useSearchParams();
    const form = useRef<ProFormInstance>(null);
    const id: any = searchParams.get('id') || '';
    const [student, setStudent] = useState<API.StudentDTO>();
    interface option {
        value: number,
        label: string,
    }
    const options: option[] = [{ value: 1, label: '男' }, { value: 2, label: '女' }];
    useEffect(() => {
        getStudent({ id }).then((result: any) => {
            setStudent(result || {});
            form?.current?.setFieldsValue(result);
        });
    }, []);
    const onFinish = async (values: any) => {
        const { studentname, userCode, sex, parentname, phone, classid } = values;
        const data: API.StudentDTO = {
            id,
            studentname,
            userCode,
            sex,
            parentname,
            phone,
            classid,
        };

        try {
            await updateStudent(data, { throwError: true });
            message.success('保存成功');
            history.push('/gradeManage/studentInformation');
        } catch (ex) {
            return true;
        }
        return true;
    };
    return (
        <PageContainer>
            <ProForm formRef={form} onFinish={(values) => onFinish(values)}>
                <ProForm.Group>
                    <ProFormText
                        name="studentname"
                        label="学生姓名"
                        rules={[
                            {
                                required: true,
                                message: '请输入学生姓名！',
                            },
                        ]}
                    />
                    <ProFormSelect<number>
                        name="sex"
                        label="性别(男1女2)"
                        width="xs"
                        options={options}
                    />
                </ProForm.Group>

                <ProForm.Group>
                    <ProFormText
                        name="userCode"
                        label="学号"
                        rules={[
                            {
                                required: true,
                                message: '请输入学号!',
                            },
                            {
                                pattern: /^(?:[1-9]\d*|0)?(?:\.\d+)?$/,
                                message: '请输入正确的学号!',
                            },
                        ]}
                    />
                    <ProFormText
                        name="classid"
                        label="班级号"
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
                <ProForm.Group>
                    <ProFormText
                        name="parentname"
                        label="家长姓名"
                        rules={[
                            {
                                required: true,
                                message: '请输入家长姓名!',
                            },
                        ]}
                    />
                    <ProFormText
                        name="phone"
                        label="家长电话"
                        rules={[
                            {
                                required: true,
                                message: '请输入家长电话!',
                            },
                        ]}
                    />
                </ProForm.Group>
            </ProForm>
        </PageContainer>
    );
};
