import { convertPageData, orderBy, waitTime } from '@/utils/request';
import { openConfirm } from '@/utils/ui';
import { PlusOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState, useEffect } from 'react';
import InputDialog from '../../studentInformation/InputDialog';
import { deleteStudent, listStudent } from '@/services/api/student';
import React from 'react';
import { downloadFile } from '@/utils/download-utils';


interface StudentDialogProps {
    detailData?: API.StudentDTO;
    classid: number;
    visible: boolean;
    onClose: (result: boolean) => void;
}

export default function StudentDialog(props: StudentDialogProps) {
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
    const [student, setStudent] = useState<API.StudentVO>();
    const [downloading, setDownloading] = useState(false);
    const [searchProps, setSearchProps] = useState<API.StudentQueryDTO>({});
    const [visible, setVisible] = useState(false);


    const columns: ProColumns<API.StudentVO>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 100,
            search: false,
        },
        {
            title: '学生姓名',
            dataIndex: 'studentname',
            width: 100,
            render: (dom, record) => {
                return (
                    <a
                        onClick={() => {
                            setStudent(record);
                            setVisible(true);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: '性别',
            dataIndex: 'sex',
            width: 100,
            search: false,
        },
        {
            title: '学号',
            dataIndex: 'userCode',
            width: 150,
            // search: false,
        },
        {
            title: '班级号',
            dataIndex: 'classid',
            width: 100,
            search: false,
        },
        {
            title: '家长姓名',
            dataIndex: 'parentname',
            width: 100,
            search: false,
        },
        {
            title: '家长电话',
            dataIndex: 'phone',

            search: false,
        },
    ];

    const handleDelete = async () => {
        if (!selectedRowKeys?.length) return;
        openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
            await deleteStudent(selectedRowKeys);
            refAction.current?.reload();
        });
    };

    const onFinish = async (values: any) => {
        props.onClose(true);
        return true;
    };

    const handleExport = () => {
        setDownloading(true);
        downloadFile(`/api/student/exportStudent`, searchProps, '班级学生信息导出表.xls').then(() => {
            waitTime(1000).then(() => setDownloading(false));
        });
    };

    const classid = props.classid;

    return (
        <ModalForm
            width={1000}
            onFinish={onFinish}
            formRef={form}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => props.onClose(false),
            }}
            title="查询已录入学生"
            open={props.visible}
        >
            <ProTable<API.StudentVO>
                actionRef={refAction}
                search={false}
                rowKey="id"
                request={async (params = {}, sort) => {
                    const props = {
                        ...params,
                        classid: classid,
                        orderBy: orderBy(sort),
                    };
                    setSearchProps(props);
                    return convertPageData(await listStudent(props));
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            setStudent(props);
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
                detailData={student}
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
