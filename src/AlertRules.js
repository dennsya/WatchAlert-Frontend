import React, { useEffect, useState } from 'react'
import { Button, Input, Table, Select, Popconfirm, Dropdown, Tag, message } from 'antd'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import AlertRuleCreateModal from './AlertRuleCreateModal'
import backendIP from './config'
import Base from './Base'

const { Search } = Input

const AlertRules = () => {
  const [selectedRow, setSelectedRow] = useState(null)
  const [updateVisible, setUpdateVisible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [list, setList] = useState([])

  const { id } = useParams()

  useEffect(() => {
    handleList(id)
  }, [])

  const handleList = async (id) => {
    const res = await axios.get(`http://${backendIP}/api/w8t/rule/ruleList?ruleGroupId=${id}`)
    setList(res.data.data)
  }

  const handleDelete = async (_, record) => {
    try {
      await axios.post(`http://${backendIP}/api/w8t/rule/ruleDelete?id=${record.ruleId}`)
      message.success('删除成功')
      handleList()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleModalClose = () => {
    setVisible(false)
  }

  const handleUpdateModalClose = () => {
    setUpdateVisible(false)
  }

  const handleUpdateModalOpen = (record) => {
    setSelectedRow(record)
    setUpdateVisible(true)
  }

  const onSearch = (value, _e, info) => {
    console.log(info?.source, value)
  }

  const items = [
    {
      key: '1',
      label: '批量删除',
    },
  ]

  const onMenuClick = (e) => { }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ruleId',
      key: 'ruleId',
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
    },
    {
      title: '数据源类型',
      dataIndex: 'datasourceType',
      key: 'datasourceType',
    },
    {
      title: '数据源',
      dataIndex: 'datasourceId',
      key: 'datasourceId',
      width: 200,
      render: (text, record) => (
        <span>
          {Object.entries(record.datasourceId).map(([key, value]) => (
            <Tag color="processing" key={key}>{`${value}`}</Tag>
          ))}
        </span>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: enabled => (
        enabled ?
          <Tag color="success">启用</Tag> :
          <Tag color="error">禁用</Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right', // 设置操作列固定
      render: (_, record) => (
        list.length >= 1 ? (
          <div>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(_, record)}>
              <a>删除</a>
            </Popconfirm>

            <Button
              type="link"
              onClick={() => handleUpdateModalOpen(record)}>
              更新
            </Button>
          </div>
        ) : null
      ),
    },
  ]

  return (
    <Base name="告警规则">
      <div>
        <div style={{ display: 'flex' }}>
          <Button type="primary" onClick={() => setVisible(true)}>
            创建
          </Button>

          <AlertRuleCreateModal
            visible={visible}
            onClose={handleModalClose}
            type="create"
            handleList={handleList}
            ruleGroupId={id}
          />

          <AlertRuleCreateModal
            visible={updateVisible}
            onClose={handleUpdateModalClose}
            selectedRow={selectedRow}
            type="update"
            handleList={handleList}
            ruleGroupId={id}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              width: '1000px',
            }}
          >
            <Select
              placeholder="数据源类型"
              style={{ width: 150 }}
              allowClear
              options={[
                {
                  value: 'Prometheus',
                  label: 'Prometheus',
                },
              ]}
            />

            <Select
              placeholder="数据源"
              style={{ width: 100 }}
              allowClear
              options={[
                {
                  value: '1',
                  label: 'test',
                },
              ]}
            />

            <Select
              placeholder="状态"
              style={{ width: 100 }}
              allowClear
              options={[
                {
                  value: 'true',
                  label: '启用',
                },
                {
                  value: 'false',
                  label: '禁用',
                },
              ]}
            />

            <Search
              allowClear
              placeholder="输入搜索关键字"
              onSearch={onSearch}
              enterButton
              style={{ width: 300 }}
            />
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <Dropdown.Button
              menu={{
                items,
                onClick: onMenuClick,
              }}
            >
              更多操作
            </Dropdown.Button>
          </div>
        </div>

        <div style={{ overflowX: 'auto', marginTop: 10, height: '65vh' }}>
          <Table
            columns={columns}
            dataSource={list}
            scroll={{
              x: 1500,
              y: 'calc(60vh - 64px - 40px)',
            }}
          />
        </div>
      </div>
    </Base>
  )
}

export default AlertRules