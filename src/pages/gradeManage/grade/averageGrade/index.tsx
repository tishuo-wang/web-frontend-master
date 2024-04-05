import { convertPageData, orderBy } from '@/utils/request';
import { ActionType, ModalForm,  ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Button, Input, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { listAverageGrade } from '@/services/api/grade';

interface AverageGradeProps {
    visible: boolean;
    onClose: (result: boolean) => void;
}


export default function AverageGrade(props: AverageGradeProps) {
    const form = useRef<ProFormInstance>(null);

    const refAction = useRef<ActionType>(null);
    const [term, setTerm] = useState<string>();

    const [academicyear, setacademicyear] = useState<string>();


    interface option {
        value: string;
        label: string;
    };
    const termList: option[] = Array();
    const changeAcademicyear = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const newValue = event.currentTarget.value;
        setacademicyear(newValue);
        refAction.current?.reload();
    };
    var changeTerm = (value: string) => {
        setTerm(value);
        refAction.current?.reload();
    };
    const termSP: option = { value: '春季', label: '春季' };
    const termAU: option = { value: '秋季', label: '秋季' };
    termList.push(termSP);
    termList.push(termAU);

    const columns: ProColumns<API.GradeAverVO>[] = [
        {
            title: '班级号',
            dataIndex: 'classid',
            search: false,
            defaultSortOrder: 'ascend',
            sorter: (a, b) => {
                const aClassid = a.classid ? parseInt(a.classid, 10) : 0;
                const bClassid = b.classid ? parseInt(b.classid, 10) : 0;
                return aClassid - bClassid;
            },
        },
        {
            title: '语文平均成绩',
            dataIndex: 'averageChinese',
            search: false,
            sorter: (a, b) => {
                const aChinese = a.averageChinese ?? 0;
                const bChinese = b.averageChinese ?? 0;
                return aChinese - bChinese;
            },
        },
        {
            title: '数学平均成绩',
            dataIndex: 'averageMath',
            search: false,
            sorter: (a, b) => {
                const aMath = a.averageMath ?? 0;
                const bMath = b.averageMath ?? 0;
                return aMath - bMath;
            },
        },
        {
            title: '英语平均成绩',
            dataIndex: 'averageEnglish',
            search: false,
            sorter: (a, b) => {
                const aEnglish = a.averageEnglish ?? 0;
                const bEnglish = b.averageEnglish ?? 0;
                return aEnglish - bEnglish;
            },
        },
        {
            title: '平均成绩总和',
            dataIndex: 'total',
            search: false,
            sorter: (a, b) => {
                const aTotal = a.total ?? 0;
                const bTotal = b.total ?? 0;
                return aTotal - bTotal;
            },
        },
    ];

    // 输入过程中直接查找
    // useEffect(() => {
    //     if (refAction.current) {
    //         refAction.current.reload();
    //     }
    // }, [academicyear, term]);

    const onFinish = async (values: any) => {
        props.onClose(true);
        return true;
    };

    return (
        <ModalForm
            width={800}
            onFinish={onFinish}
            formRef={form}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => props.onClose(false),
            }}
            title="查询平均成绩"
            open={props.visible}
        >
            <ProTable<API.GradeAverVO>
                search={false}
                actionRef={refAction}
                rowKey="classid"
                request={async (params = {}, sort) => {
                    const props = {
                        ...params,
                        term: term,
                        academicyear: academicyear,
                        orderBy: orderBy(sort),
                    };

                    return convertPageData(await listAverageGrade(props));
                }}
                toolBarRender={() => [
                    <Input
                        style={{ width: 200 }}
                        value={academicyear}
                        onChange={(event) => {
                            setacademicyear(event.target.value);
                        }}
                        onPressEnter={changeAcademicyear}
                        placeholder='输入学年'
                    />,
                    <Select
                        style={{ width: 200 }}
                        value={term ? term : undefined}
                        onChange={changeTerm}
                        options={termList}
                        placeholder='筛选学期'
                    />,
                    <Button type="primary" ghost onClick={() => { setacademicyear(""); changeTerm(""); refAction.current?.reload(); }}>
                        重置
                    </Button>,
                ]}
                columns={columns}

            />
        </ModalForm>
    );
};