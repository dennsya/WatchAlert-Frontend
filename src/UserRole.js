import { Input, Table, Button, Popconfirm, message } from 'antd'
import React from 'react'
import axios from 'axios'
import UserRoleCreateModal from './UserRoleCreateModal'
import backendIP from './config'
import Base from './Base'
const { Search } = Input

class UserRole extends React.Component {

  state = {
    selectedRow: null,
    updateVisible: false,
    changeVisible: false,
    selectedUserId: null,
    visible: false,
    list: [],
    columns: [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50,
      },
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
        width: 50,
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        width: 50,
      },
      {
        title: '创建时间',
        dataIndex: 'create_at',
        key: 'create_at',
        width: 50,
        render: (text) => {
          const date = new Date(text * 1000)
          return date.toLocaleString()
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 50,
        render: (_, record) =>
          this.state.list.length >= 1 ? (
            <div>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(_, record)}
                disabled={record.name === 'admin'}>
                <a style={{ cursor: record.name === 'admin' ? 'not-allowed' : 'pointer' }}>删除</a>
              </Popconfirm>
              <Button
                type="link" onClick={() => this.handleUpdateModalOpen(record)}>
                更新
              </Button>
            </div>
          ) : null,
      },
    ]
  }

  async componentDidMount () {
    this.handleList()
  }

  handleList = async () => {
    const res = await axios.get(`http://${backendIP}/api/w8t/role/roleList`)
    this.setState({
      list: res.data.data,
    })
  };

  handleDelete = async (_, record) => {
    axios.post(`http://${backendIP}/api/w8t/role/roleDelete?id=${record.id}`)
      .then((res) => {
        if (res.status === 200) {
          message.success("删除成功")
          this.handleList()
        }
      })
      .catch(() => {
        message.error("删除失败")
      })
  };

  handleModalClose = () => {
    this.setState({ visible: false })
  };

  handleChanagePassModalClose = () => {
    this.setState({ changeVisible: false })
  };

  handleUpdateModalClose = () => {
    this.setState({ updateVisible: false })
  }

  handleUpdateModalOpen = (record) => {
    this.setState({
      selectedRow: record,
      updateVisible: true,
    })
  };

  render () {

    const onSearch = (value, _e, info) => console.log(info?.source, value)

    return (
      <Base name='角色管理'>
        <div>
          <div style={{ display: 'flex' }}>

            <Button type="primary" onClick={() => this.setState({ visible: true })}>
              创建
            </Button>

            <UserRoleCreateModal visible={this.state.visible} onClose={this.handleModalClose} type='create' handleList={this.handleList} />

            <UserRoleCreateModal visible={this.state.updateVisible} onClose={this.handleUpdateModalClose} selectedRow={this.state.selectedRow} type='update' handleList={this.handleList} />

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

          <div style={{ overflowX: 'auto', marginTop: 10, height: '65vh' }}>
            <Table
              columns={this.state.columns}
              dataSource={this.state.list}
              scroll={{
                x: 1500,
                y: 'calc(60vh - 64px - 40px)'
              }}
            />
          </div>
        </div>
      </Base>
    )

  }

}

export default UserRole