import { Button, Input, Table, Select, Popconfirm, Dropdown, message } from 'antd'
import axios from 'axios'
import React from 'react'
import NoticeObjectCreateModal from './NoticeObjectCreateModal'
import backendIP from './config'
import Base from './Base'
const { Search } = Input

class NoticeObjects extends React.Component {

  state = {
    selectedRow: null,
    updateVisible: false,
    visible: false,
    list: [],
    // 表头
    columns: [
      {
        title: 'ID',
        dataIndex: 'uuid',
        key: 'uuid',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '环境',
        dataIndex: 'env',
        key: 'env',
      },
      {
        title: '通知类型',
        dataIndex: 'noticeType',
        key: 'noticeType',
        render: (text, record) => {
          if (record.noticeType === 'FeiShu') {
            return '飞书'
          } else if (record.noticeType === 'DingDing') {
            return '钉钉'
          }
          return ''
        },
      },
      {
        title: '值班ID',
        dataIndex: 'dutyId',
        key: 'dutyId',
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

              <Button
                type="link" onClick={() => this.handleUpdateModalOpen(record)}>
                更新
              </Button>
            </div>
          ) : null,
      },
    ]
  }

  handleUpdateModalClose = () => {
    this.setState({ updateVisible: false })
  }

  handleUpdateModalOpen = (record) => {
    this.setState({
      selectedRow: record,
      updateVisible: true,
    })
  };

  async handleDelete (_, record) {
    axios.post(`http://${backendIP}/api/w8t/notice/noticeDelete?uuid=${record.uuid}`)
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

  handleList = async () => {

    const res = await axios.get(`http://${backendIP}/api/w8t/notice/noticeList`)
    this.setState({
      list: res.data.data
    })

  }

  handleModalClose = () => {
    this.setState({ visible: false })
  };

  componentDidMount () {
    this.handleList()
  }

  render () {

    const onSearch = (value, _e, info) => console.log(info?.source, value)

    const items = [
      {
        key: '1',
        label: '批量删除',
      },
    ]

    const onMenuClick = (e) => {
    }

    return (
      <Base name='通知对象'>
        <div>
          <div style={{ display: 'flex' }}>
            <Button type="primary" onClick={() => this.setState({ visible: true })}>
              创建
            </Button>

            <NoticeObjectCreateModal visible={this.state.visible} onClose={this.handleModalClose} type='create' handleList={this.handleList} />

            <NoticeObjectCreateModal visible={this.state.updateVisible} onClose={this.handleUpdateModalClose} selectedRow={this.state.selectedRow} type='update' handleList={this.handleList} />

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

            <div style={{ marginLeft: 'auto' }}>
              <Dropdown.Button
                menu={{
                  items,
                  onClick: onMenuClick,
                }}>
                更多操作
              </Dropdown.Button>
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

export default NoticeObjects