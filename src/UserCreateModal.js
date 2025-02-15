import { Modal, Form, Input, Button, Select, Switch, message } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import backendIP from './config'

const MyFormItemContext = React.createContext([])

function toArr (str) {
  return Array.isArray(str) ? str : [str]
}

// 表单
const MyFormItem = ({ name, ...props }) => {
  const prefixPath = React.useContext(MyFormItemContext)
  const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined
  return <Form.Item name={concatName} {...props} />
}

// 函数组件
const UserCreateModal = ({ visible, onClose, selectedRow, type, handleList }) => {
  const [form] = Form.useForm()
  const [checked, setChecked] = useState() // 修改这里
  const [roleData, setRoleData] = useState([])
  const [username, setUsername] = useState("")

  // 禁止输入空格
  const [spaceValue, setSpaceValue] = useState('')

  const handleInputChange = (e) => {
    // 移除输入值中的空格
    const newValue = e.target.value.replace(/\s/g, '')
    setSpaceValue(newValue)
  }

  const handleKeyPress = (e) => {
    // 阻止空格键的默认行为
    if (e.key === ' ') {
      e.preventDefault()
    }
  }

  useEffect(() => {
    if (selectedRow) {
      if (type === 'update') {
        setChecked(selectedRow.joinDuty === 'true' ? true : false)
        setUsername(selectedRow.username)
      }
      form.setFieldsValue({
        username: selectedRow.username,
        phone: selectedRow.phone,
        email: selectedRow.email,
        joinDuty: selectedRow.joinDuty, // 修改这里
        dutyUserId: selectedRow.dutyUserId,
        role: selectedRow.role
      })
    }
  }, [selectedRow, form])

  // 创建
  const handleCreate = (values) => {
    axios.post(`http://${backendIP}/api/system/register`, values)
      .then((res) => {
        if (res.status === 200) {
          message.success("创建成功")
          handleList()
        }
      })
      .catch(() => {
        message.error("创建失败")
      })
  }

  // 更新
  const handleUpdate = (values) => {
    axios.post(`http://${backendIP}/api/w8t/user/userUpdate`, values)
      .then((res) => {
        if (res.status === 200) {
          message.success("更新成功")
          handleList()
        }
      })
      .catch(() => {
        message.error("更新失败")
      })
  }

  // 提交
  const handleFormSubmit = (values) => {

    if (type === 'create') {
      const newValues = {
        ...values,
        joinDuty: values.joinDuty ? "true" : "false"
      }
      handleCreate(newValues)

    }

    if (type === 'update') {
      const newValues = {
        ...values,
        joinDuty: values.joinDuty ? "true" : "false",
        userid: selectedRow.userid,
        password: selectedRow.password,
      }

      handleUpdate(newValues)
    }

    // 关闭弹窗
    onClose()

  }

  const handleGetRoleData = async () => {
    const res = await axios.get(`http://${backendIP}/api/w8t/role/roleList`)

    const newData = res.data.data.map((item) => ({
      label: item.name,
      value: item.name
    }))

    setRoleData(newData)
  }

  const onChangeJoinDuty = (checked) => {
    console.log("---", checked)
    setChecked(checked) // 修改这里
  }

  return (
    <Modal visible={visible} onCancel={onClose} footer={null}>
      <Form form={form} name="form_item_path" layout="vertical" onFinish={handleFormSubmit}>

        <div style={{ display: 'flex' }}>
          <MyFormItem name="username" label="用户名"
            style={{
              marginRight: '10px',
              width: '500px',
            }}
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}>
            <Input
              value={spaceValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={type === 'update'} />
          </MyFormItem>
          {type === 'create' && <Form.Item
            name="password"
            label="密码"
            style={{
              marginRight: '10px',
              width: '500px',
            }}
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>}

        </div>

        <MyFormItem name="phone" label="手机号">
          <Input />
        </MyFormItem>

        <MyFormItem name="email" label="邮箱">
          <Input />
        </MyFormItem>

        <MyFormItem name="role" label="用户角色"
          rules={[
            {
              required: true,
              message: 'Please input your Role!',
            },
          ]}>
          <Select
            placeholder="请选择用户角色"
            onClick={handleGetRoleData}
            options={roleData}
            disabled={username === "admin"}
          />
        </MyFormItem>

        <MyFormItem name="joinDuty" label="接受值班">
          <Switch checked={checked} onChange={onChangeJoinDuty} />
        </MyFormItem>

        {checked === true && <MyFormItem name="dutyUserId" label="UserID「飞书/钉钉」"
          rules={[
            {
              required: true,
              message: 'Please input your UserID!',
            },
          ]}>
          <Input />
        </MyFormItem>}

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </Modal>
  )
}

export default UserCreateModal