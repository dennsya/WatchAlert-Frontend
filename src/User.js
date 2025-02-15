import { Select, Input, Table, Button, Popconfirm, message } from 'antd'
import axios from 'axios'
import React from 'react'
import UserCreateModal from './UserCreateModal'
import UserChangePass from './UserChangePass'
import backendIP from './config'
import Base from './Base'
const { Search } = Input

class User extends React.Component {

  state = {
    selectedRow: null,
    updateVisible: false,
    changeVisible: false,
    selectedUsername: null,
    selectedUserId: null,
    visible: false,
    list: [],
    columns: [
      {
        title: 'ID',
        dataIndex: 'userid',
        key: 'userid',
        width: 30,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        width: 30,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 40,
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
        width: 40,
      },
      {
        title: '创建人',
        dataIndex: 'create_by',
        key: 'create_by',
        width: 40,
      },
      {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
        width: 30,
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
              <Button type="link"
                onClick={() => this.setState({ changeVisible: true, selectedUserId: record.userid, selectedUsername: record.username })}
              >
                重置密码
              </Button>
              <UserChangePass visible={this.state.changeVisible} onClose={this.handleChanagePassModalClose} userid={this.state.selectedUserId} username={this.state.selectedUsername} />
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(_, record)}
                disabled={record.username === 'admin'}>
                <a style={{ cursor: record.username === 'admin' ? 'not-allowed' : 'pointer' }}>删除</a>
              </Popconfirm>
              <Button type="link"
                onClick={() => this.handleUpdateModalOpen(record)}              >
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
    const res = await axios.get(`http://${backendIP}/api/w8t/user/userList`)
    this.setState({
      list: res.data.data,
    })
  };

  handleDelete = async (_, record) => {
    axios.post(`http://${backendIP}/api/w8t/user/userDelete?userid=${record.userid}`)
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
      <Base name='用户管理'>
        <div>
          <div style={{ display: 'flex' }}>

            <Button type="primary" onClick={() => this.setState({ visible: true })}>
              创建
            </Button>

            <UserCreateModal visible={this.state.visible} onClose={this.handleModalClose} type='create' handleList={this.handleList} />

            <UserCreateModal visible={this.state.updateVisible} onClose={this.handleUpdateModalClose} selectedRow={this.state.selectedRow} type='update' handleList={this.handleList} />

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              width: '1000px'
            }}>
              <Select
                placeholder="状态"
                style={{
                  // flex: 1,
                  width: 150
                }}
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

export default User