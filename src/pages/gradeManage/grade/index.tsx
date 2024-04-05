import { convertPageData, orderBy, waitTime } from '@/utils/request';
import { openConfirm } from '@/utils/ui';
import { PlusOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import InputDialog from './InputDialog';
import { downloadFile } from '@/utils/download-utils';
import { Link } from '@umijs/max';
import ImportDialog from './ImportDialog';
import React from 'react';
import { deleteGrade, listAverageGrade, listGrade } from '@/services/api/grade';

import AverageGrade from './averageGrade';




export default () => {
    const refAction = useRef<ActionType>(null);
    const [selectedRowKeys, selectRow] = useState<number[]>([]);
    const [importVisible, setImportVisible] = useState(false);
    const [averageVisible, setAverageVisible] = useState(false);
    const [grade, setGrade] = useState<API.GradeVO>();
    const [searchProps, setSearchProps] = useState<API.GradeQueryDTO>({});
    const [visible, setVisible] = useState(false);
    const [downloading, setDownloading] = useState(false);
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
            sorter: (a, b) => {
                const aUserCode = a.userCode ? parseInt(a.userCode, 10) : 0;
                const bUserCode = b.userCode ? parseInt(b.userCode, 10) : 0;
                return aUserCode - bUserCode;
            },
        },
        {
            title: '班级号',
            dataIndex: 'classid',
            width: 100,
            // search: false,
            sorter: (a, b) => {
                const aClassid = a.classid ? parseInt(a.classid, 10) : 0;
                const bClassid = b.classid ? parseInt(b.classid, 10) : 0;
                return aClassid - bClassid;
            },
        },
        {
            title: '语文',
            dataIndex: 'chineseGrade',
            width: 80,
            search: false,
        },
        {
            title: '数学',
            dataIndex: 'mathGrade',
            width: 80,
            search: false,
        },
        {
            title: '英语',
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
            // search: false,
        },
        {
            title: '操作',
            width: 100,
            fixed: 'right',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [<Link to={`detail?id=${record.id}`}>修改</Link>],
        },
    ];

    const handleDelete = async () => {
        if (!selectedRowKeys?.length) return;
        openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
            await deleteGrade(selectedRowKeys);
            refAction.current?.reload();
        });
    };

    const handleExport = () => {
        setDownloading(true);
        downloadFile(`/api/grade/exportGrade`, searchProps, '成绩信息导出表.xls').then(() => {
            waitTime(1000).then(() => setDownloading(false));
        });
    };


    return (
        <PageContainer>
            <ProTable<API.GradeVO>
                actionRef={refAction}
                rowKey="id"
                request={async (params = {}, sort) => {
                    const props = {
                        ...params,
                        orderBy: orderBy(sort),
                    };
                    setSearchProps(props);
                    return convertPageData(await listGrade(props));
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => { setAverageVisible(true); }}
                    >
                        查询班级平均分
                    </Button>,

                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            setGrade(undefined);
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
                    <Button
                        type="primary"
                        key="primary"
                        icon={<PlusOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                        onClick={() => {
                            setImportVisible(true);
                        }}
                    >
                        导入
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
                disable={false}
                onClose={(result) => {
                    setVisible(false);
                    result && refAction.current?.reload();
                }}
                visible={visible}
            />
            <ImportDialog
                visible={importVisible}
                onClose={(count) => {
                    setImportVisible(false);
                    if (count) {
                        refAction.current?.reload();
                    }
                }}
            />
            <AverageGrade
                visible={averageVisible}
                onClose={() => {
                    setAverageVisible(false);
                }}
            />

        </PageContainer>
    );
};
