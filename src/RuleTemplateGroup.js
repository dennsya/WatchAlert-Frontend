import { Button, Input, Table, Popconfirm, Dropdown, message } from 'antd'
import axios from 'axios'
import React from 'react'
import RuleTemplateGroupCreateModal from './RuleTemplateGroupCreateModal'
import backendIP from './config'
import Base from './Base'
import { Link } from 'react-router-dom'

const { Search } = Input

class RuleTemplateGroup extends React.Component {

  state = {
    selectedRow: null,
    updateVisible: false,
    visible: false,
    list: [],
    // 表头
    columns: [
      {
        title: '模版组名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link to={`/ruleTemplateGroup/${record.name}/ruleTemplate`}>{text}</Link>
            </div>
          </div>
        ),
      },
      {
        title: '模版数',
        dataIndex: 'number',
        key: 'number',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, record) =>
          this.state.list.length >= 1 ? (
            <div>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(_, record)}>
                <a>删除</a>
              </Popconfirm>
            </div>
          ) : null,
      },
    ]
  }

  handleList = async () => {
    const res = await axios.get(`http://${backendIP}/api/w8t/ruleTmplGroup/ruleTmplGroupList`)
    console.log(res)
    this.setState({
      list: res.data.data
    })
  }

  // 删除
  async handleDelete (_, record) {
    axios.post(`http://${backendIP}/api/w8t/ruleTmplGroup/ruleTmplGroupDelete?tmplGroupName=${record.name}`)
      .then((res) => {
        if (res.status === 200) {
          message.success("删除成功")
          this.handleList()
        }
      })
      .catch(() => {
        message.error("删除失败")
      })
  }

  componentDidMount () {
    this.handleList()
  }


  handleModalClose = () => {
    this.setState({ visible: false })
  }

  handleUpdateModalClose = () => {
    this.setState({ updateVisible: false })
  }

  handleUpdateModalOpen = (record) => {
    this.setState({
      selectedRow: record,
      updateVisible: true,
    })
  }

  render () {

    const onSearch = (value, _e, info) => console.log(info?.source, value)

    const onMenuClick = (e) => {
    }

    return (
      <Base name='规则模版'>
        <div>
          <div style={{ display: 'flex' }}>
            <Button type="primary" onClick={() => this.setState({ visible: true })}>
              创建
            </Button>

            <RuleTemplateGroupCreateModal visible={this.state.visible} onClose={this.handleModalClose} type='create' handleList={this.handleList} />

            <RuleTemplateGroupCreateModal visible={this.state.updateVisible} onClose={this.handleUpdateModalClose} selectedRow={this.state.selectedRow} type='update' handleList={this.handleList} />

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              width: '1000px'
            }}>

              <Search
                allowClear
                placeholder="输入搜索关键字"
                onSearch={onSearch}
                enterButton
                style={{ width: 300 }} />
            </div>
          </div>

          <div style={{ overflowX: 'auto', marginTop: 10 }}>
            <Table
              columns={this.state.columns}
              dataSource={this.state.list}
            />
          </div>
        </div>
      </Base>
    )

  }

}

export default RuleTemplateGroup