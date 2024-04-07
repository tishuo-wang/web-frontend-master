
import { getGrade, updateGrade } from '@/services/api/grade';
import { PageContainer, ProForm, ProFormText, ProFormInstance } from '@ant-design/pro-components';
import { history, useSearchParams } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useState, useRef } from 'react';


export default () => {
    const [searchParams] = useSearchParams();
    const form = useRef<ProFormInstance>(null);
    const id: any = searchParams.get('id') || '';
    const [grade, setGrade] = useState<API.GradeDTO>();

    useEffect(() => {
        getGrade({ id }).then((result) => {
            setGrade(result || {});
            form?.current?.setFieldsValue(result);
        });
    }, []);
    const onFinish = async (values: any) => {
        const { name, userCode, classid, chineseGrade, mathGrade, englishGrade, recordtime, academicyear, term } = values;
        const data: API.GradeDTO = {
            id,
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
            await updateGrade(data, { throwError: true });
            message.success('保存成功');
            history.push('/gradeManage/grade');
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
                        name="name"
                        label="学生姓名"
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
                </ProForm.Group>
                <ProFormText
                    name="recordtime"
                    label="录入时间"
                    rules={[
                        {
                            required: true,
                            message: '请输入录入时间(如2024-3-19)!',
                        },
                    ]}
                />
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
            </ProForm>
        </PageContainer>
    );
};
