import { PageContainer } from '@ant-design/pro-components';
import { Link, useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <Link to={href}>跳转至详情界面 {'>'}</Link>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '25px',
              color: token.colorTextHeading,
            }}
          >
            欢迎使用成绩管理系统
          </div>
          <p
            style={{
              fontSize: '16px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 0,
              width: '65%',
            }}
          >
            本成绩管理系统的功能分为三个部分：查询学生信息、查询班级信息、查询学生成绩和班级平均分。
          </p>
          <p
            style={{
              fontSize: '16px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            本成绩管理系统面向的对象是班级管理人员以及各科目老师，使用者可以通过本系统进行学生信息、班级信息和成绩信息的查询和录入，
            并且可以下载或者上传相关信息，以实现更新信息的功能。
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              href="../gradeManage/studentInformation"
              title="学生信息"
              desc="学生信息管理模块可以实现学生信息的查询、录入、删除、批量EXCEL导入和导出，以及查询某个学生的历次考试成绩的功能。"
            />
            <InfoCard
              index={2}
              title="班级信息"
              href="../gradeManage/classInformation"
              desc="班级信息管理模块可以实现班级信息的查询、录入、删除、批量EXCEL导入和导出，以及查询某个班级已经录入的学生信息。"
            />
            <InfoCard
              index={3}
              title="成绩信息管理"
              href="../gradeManage/grade"
              desc="功能为成绩的增删改查、批量导入导出，以及学生成绩的统计功能，即通过输入学年和学期查询出按班级分组的各科平均分，并可以进行排名。"
            />
          </div>
          <p
            style={{
              fontSize: '15px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 0,
              width: '65%',
            }}
          >
            如果您有任何的意见或建议，欢迎联系:202200120151@mail.sdu.edu.cn。
          </p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
