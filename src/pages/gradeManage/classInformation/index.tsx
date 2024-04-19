import { convertPageData, orderBy, waitTime } from '@/utils/request';
import { openConfirm } from '@/utils/ui';
import { PlusOutlined, DeleteOutlined, ExportOutlined, DownloadOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import InputDialog from './InputDialog';
import DrawerInput from './DrawerInput';
import { downloadFile } from '@/utils/download-utils';
import ImportDialog from './ImportDialog';
import { deleteClasses, listClasses } from '@/services/api/classes';
import StudentDialog from './StudentDialog';




export default () => {
    const refAction = useRef<ActionType>(null);
    const [selectedRowKeys, selectRow] = useState<number[]>([]);
    const [importVisible, setImportVisible] = useState(false);
    const [classes, setClasses] = useState<API.ClassesVO>();
    const [searchProps, setSearchProps] = useState<API.ClassesQueryDTO>({});
    const [searchPropsExample, setSearchPropsExample] = useState<API.GradeQueryDTO>({});
    const [visible, setVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [studentVisible, setStudentVisible] = useState(false);
    const [classid, setClassid] = useState<number>();
    const [classNum, setClassNum] = useState<number>();
    const [classLoudNum, setClassLoudNum] = useState<number>();
    var [queryDTO] = useState<API.StudentDTO>();

    const columns: ProColumns<API.ClassesVO>[] = [
        {
            title: '班级ID',
            dataIndex: 'id',
            width: 70,
            search: false,
        },
        {
            title: '班级号',
            dataIndex: 'classid',
            width: 80,
            render: (dom, record) => {
                return (
                    <a
                        onClick={() => {
                            setClasses(record);
                            setVisible(true);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
            sorter: (a, b) => {
                const aClassid = a.classid ? parseInt(a.classid, 10) : 0;
                const bClassid = b.classid ? parseInt(b.classid, 10) : 0;
                return aClassid - bClassid;
            },
        },
        {
            title: '班级名称',
            dataIndex: 'classname',
            // search: false,
        },
        {
            title: '班主任姓名',
            dataIndex: 'teachername',
            width: 100,
            // search: false,
        },
        {
            title: '班主任电话',
            dataIndex: 'teacherphone',
            width: 150,
            search: false,
        },
        {
            title: '班级位置',
            dataIndex: 'position',
            width: 100,
            search: false,
        },
        {
            title: '人数',
            dataIndex: 'number',
            width: 60,
            search: false,
        },
        {
            title: '录入人数',
            dataIndex: 'studentNumber',
            width: 100,
            search: false,
        },
        {
            title: '查询录入情况',
            width: 150,
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <Button
                    type='dashed'
                    shape='round'
                    onClick={() => {
                        setClassid(Number(record.classid));
                        setClassNum(Number(record.number));
                        setClassLoudNum(Number(record.studentNumber))
                        setStudentVisible(true);
                    }}>
                    查询录入情况
                </Button>
            ],
        },
        {
            title: '操作',
            width: 100,
            fixed: 'right',
            dataIndex: 'option',
            valueType: 'option',
            render: (dom, record) => {
                return (
                    <a
                        onClick={() => {
                            setClasses(record);
                            setDrawerVisible(true);
                        }}
                    >
                        修改
                        {dom}
                    </a>
                );
            },
        },
    ];

    const handleDelete = async () => {
        if (!selectedRowKeys?.length) return;
        openConfirm(`您确定删除${selectedRowKeys.length}条记录吗`, async () => {
            await deleteClasses(selectedRowKeys);
            refAction.current?.reload();
        });
    };

    const handleExport = () => {
        setDownloading(true);
        downloadFile(`/api/classes/exportClasses`, searchProps, '班级信息导出表.xls').then(() => {
            waitTime(1000).then(() => setDownloading(false));
        });
    };

    const importExample = () => {
        setDownloading(true);
        downloadFile(`/api/classes/exportClasses`, searchPropsExample, '班级导入模板.xls').then(() => {
            waitTime(1000).then(() => setDownloading(false));
        });
    };

    return (
        <PageContainer>
            <ProTable<API.ClassesVO>
                actionRef={refAction}

                rowKey="id"
                request={async (params = {}, sort) => {
                    const props = {
                        ...params,
                        orderBy: orderBy(sort),
                    };
                    setSearchProps(props);

                    const propsExample = {
                        ...params,
                        classid: '-1',
                        orderBy: orderBy(sort),
                    };
                    setSearchPropsExample(propsExample);

                    return convertPageData(await listClasses(props));
                }}
                search={{
                    span: 6.5,
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            setClasses(undefined);
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
                    <Button type="default" onClick={importExample} loading={downloading}>
                        <DownloadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> 下载导入模板
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
                detailData={classes}
                onClose={(result) => {
                    setVisible(false);
                    result && refAction.current?.reload();
                }}
                visible={visible}
            />
            <DrawerInput
                detailData={classes}
                onClose={(result) => {
                    setDrawerVisible(false);
                    result && refAction.current?.reload();
                }}
                visible={drawerVisible}
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
            <StudentDialog
                detailData={queryDTO}
                classid={classid!}
                classNum={classNum!}
                classLoudNum={classLoudNum!}
                onClose={(result) => {
                    setStudentVisible(false);
                    result && refAction.current?.reload();
                }}
                visible={studentVisible}
            />
        </PageContainer>
    );
};
