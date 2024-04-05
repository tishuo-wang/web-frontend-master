import { addStudent, updateStudent } from "@/services/api/student";
import { waitTime } from "@/utils/request";
import { ModalForm, ProForm, ProFormInstance, ProFormText, ProFormSelect, useStyle } from "@ant-design/pro-components";
import { message } from "antd";
import { useEffect, useRef } from "react";


interface InputDialogProps {
  detailData?: API.StudentDTO;
  disable: boolean;
  visible: boolean;
  onClose: (result: boolean) => void;
}


export default function InputDialog(props: InputDialogProps) {
  const form = useRef<ProFormInstance>(null);
  interface option {
    value : number,
    label : string,
  }
  const options:option[] = [{value : 1, label : '男'}, {value : 2, label : '女'}];

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
    const { studentname, userCode, sex, parentname, phone, classid } = values;
    const data: API.StudentDTO = {
      id: props.detailData?.id,
      studentname,
      userCode,
      sex,
      parentname,
      phone,
      classid,
    };

    try {
      if (props.detailData) {
        await updateStudent(data, { throwError: true });
      } else {
        await addStudent(data, { throwError: true });
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
      title={props.detailData?.userCode ? '修改学生信息' : '新建学生信息'}
      open={props.visible}
    >
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
        <ProFormSelect
          name="sex"
          label="性别"
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
    </ModalForm>
  );
}
