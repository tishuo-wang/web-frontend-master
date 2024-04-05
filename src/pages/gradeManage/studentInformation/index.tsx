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
import { deleteStudent, listClassid, listStudent } from '@/services/api/student';
import React from 'react';
import { Select } from 'antd';
import GradeDialog from './GradeDialog';



export const ids = await listClassid();

export default () => {
    const refAction = useRef<ActionType>(null);
    const [selectedRowKeys, selectRow] = useState<number[]>([]);
    const [importVisible, setImportVisible] = useState(false);
    const [student, setStudent] = useState<API.StudentVO>();
    var [queryDTO] = useState<API.GradeDTO>();
    const [gradeVisible, setGradeVisible] = useState(false);
    const [searchProps, setSearchProps] = useState<API.StudentQueryDTO>({});
    const [visible, setVisible] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [classId, setClassId] = useState<number>();
    const [name, setName] = useState<string>("");
    const [classid, setClassid] = useState<string>("");
    const [userCode, setUserCode] = useState<string>("");


    interface option {
        value: number;
        label: number;
    }
    const classIdList: option[] = Array();
    const changeClassId = (value: number) => {
        setClassId(value);
        refAction.current?.reload();
    };
    ids?.forEach(function (id) {
        const classId: option = { value: id, label: id }
        classIdList.push(classId)
    });

    const columns: ProColumns<API.StudentVO>[] = [
        {
            title: '学生ID',
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
            width: 70,
            search: false,
            render: (_: any, record) => {
                return record?.sex == 1 ? '男' : '女';
              },
        },
        {
            title: '学号',
            dataIndex: 'userCode',
            width: 150,
            // search: false,
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
            search: false,
            sorter: (a, b) => {
                const aclassid = a.classid ?? 0;
                const bclassid = b.classid ?? 0;
                return aclassid - bclassid;
            },
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
        {
            title: '查询/修改成绩',
            width: 150,
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <Button
                    type='dashed'
                    shape='round'
                    onClick={() => {
                        setName(record.studentname!);
                        setClassid(String(record.classid));
                        setUserCode(record.userCode!);
                        setGradeVisible(true);
                    }}>
                    查询/修改成绩
                </Button>
            ],
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
            await deleteStudent(selectedRowKeys);
            refAction.current?.reload();
        });
    };

    const handleExport = () => {
        setDownloading(true);
        downloadFile(`/api/student/exportStudent`, searchProps, '学生信息导出表.xls').then(() => {
            waitTime(1000).then(() => setDownloading(false));
        });
    };

    return (
        <PageContainer>
            <ProTable<API.StudentVO>
                actionRef={refAction}
                rowKey="id"
                request={async (params = {}, sort) => {
                    const props = {
                        ...params,
                        classid: classId,
                        orderBy: orderBy(sort),
                    };
                    setSearchProps(props);
                    return convertPageData(await listStudent(props));
                }}
                toolBarRender={() => [
                    <Button type="primary" ghost onClick={() => { changeClassId(0); refAction.current?.reload(); }}>
                        重置
                    </Button>,
                    <Select
                        style={{ width: 120 }}
                        value={classId ? classId : undefined}
                        onChange={changeClassId}
                        options={classIdList}
                        placeholder='筛选班级ID'
                    />,


                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            setStudent(undefined);
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
                detailData={student}
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
            <GradeDialog
                detailData={queryDTO}
                name={name}
                classid={classid}
                userCode={userCode}
                onClose={(result) => {
                    setGradeVisible(false);
                    result && refAction.current?.reload();
                }}
                visible={gradeVisible}
            />
        </PageContainer>
    );
};
