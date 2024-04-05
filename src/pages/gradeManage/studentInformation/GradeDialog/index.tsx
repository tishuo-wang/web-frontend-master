import { waitTime, convertPageData, orderBy } from '@/utils/request';
import { openConfirm } from '@/utils/ui';
import { PlusOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { downloadFile } from '@/utils/download-utils';
import InputDialog from '../../grade/InputDialog';
import React from 'react';
import { deleteGrade, listGrade } from '@/services/api/grade';


interface GradeDialogProps {
    detailData?: API.GradeDTO;
    name: string;
    classid: string;
    userCode: string;
    visible: boolean;
    onClose: (result: boolean) => void;
}

export default function GradeDialog(props: GradeDialogProps) {
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


    const refAction = useRef<ActionType>(null);
    const [selectedRowKeys, selectRow] = useState<number[]>([]);
    const [downloading, setDownloading] = useState(false);
    const [grade, setGrade] = useState<API.GradeVO>();
    const [searchProps, setSearchProps] = useState<API.GradeQueryDTO>({});
    const [visible, setVisible] = useState(false);
    const columns: ProColumns<API.GradeVO>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 70,
            search: false,
        },
        {
            title: '学生姓名',
            dataIndex: 'name',
            width: 100,
            render: (dom, record) => {
                return (
                    <a
                        onClick={() => {
                            setGrade(record);
                            setVisible(true);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: '学号',
            dataIndex: 'userCode',
            width: 150,
            search: false,
        },
        {
            title: '班级号',
            dataIndex: 'classid',
            width: 100,
            search: false,
        },
        {
            title: '语文成绩',
            dataIndex: 'chineseGrade',
            width: 80,
            search: false,
        },
        {
            title: '数学成绩',
            dataIndex: 'mathGrade',
            width: 80,
            search: false,
        },
        {
            title: '英语成绩',
            dataIndex: 'englishGrade',
            width: 80,
            search: false,
        },
        {
            title: '录入时间',
            dataIndex: 'recordtime',
            width: 130,
            search: false,
        },
        {
            title: '学年',
            dataIndex: 'academicyear',
            width: 70,
            search: false,
        },
        {
            title: '学期',
            dataIndex: 'term',
            search: false,
        },
    ];

    const onFinish = async (values: any) => {
        props.onClose(true);
        return true;
    };
    const handleDelete = async () => {
        if (!selectedRowKeys?.length) return;
        openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
            await deleteGrade(selectedRowKeys);
            refAction.current?.reload();
        });
    };

    const handleExport = () => {
        setDownloading(true);
        downloadFile(`/api/grade/exportGrade`, searchProps, '个人成绩信息导出表.xls').then(() => {
            waitTime(1000).then(() => setDownloading(false));
        });
    };

    const name = props.name;


    return (
        <ModalForm
            width={1000}
            onFinish={onFinish}
            formRef={form}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => props.onClose(false),
            }}
            title="查询成绩"
            open={props.visible}
        >

            <ProTable<API.GradeVO>
                actionRef={refAction}
                search={false}
                rowKey="id"
                request={async (params = {}, sort) => {
                    const props = {
                        ...params,
                        name: name,
                        orderBy: orderBy(sort),
                    };
                    setSearchProps(props);
                    return convertPageData(await listGrade(props));
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            setGrade(props);
                            setVisible(true);
                        }}
                    >
                        <PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 新建
                    </Button>,
                    <Button
                        type="primary"
                        key="primary"
                        danger
                        onClick={handleDelete}
                        disabled={!selectedRowKeys?.length}
                    >
                        <DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 删除
                    </Button>,
                    <Button type="default" onClick={handleExport} loading={downloading}>
                        <ExportOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 导出
                    </Button>,

                ]}
                columns={columns}
                rowSelection={{
                    onChange: (rowKeys) => {
                        selectRow(rowKeys as number[]);
                    },
                }}
            />
            <InputDialog
                detailData={grade}
                disable={true}
                onClose={(result) => {
                    setVisible(false);
                    result && refAction.current?.reload();
                }}
                visible={visible}
            />



        </ModalForm>
    );
};
