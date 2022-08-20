const { assert } = require("chai")

const TodoList = artifacts.require('./TodoList.sol')

contract('TodoList', (accounts) => {
    before(async () => {
        this.todoList = await TodoList.deployed()
    })

    it('deploys successfully', async () => {
        let address = await this.todoList.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('list tasks', async () => {
        let taskCount = await this.todoList.taskCount()
        let task = await this.todoList.tasks(taskCount)
        assert.equal(task.completed, false)
        assert.equal(task.content, 'Default task')
        assert.equal(task.id.toNumber(), taskCount.toNumber())
    })

    it('creates tasks', async () => {
        const result = await this.todoList.createTask('New task')
        const taskCount = await this.todoList.taskCount()
        assert.equal(taskCount, 2)

        // Emitted event
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.content, 'New task')
        assert.equal(event.completed, false)
    })

    it('toggles task', async () => {
        const result = await this.todoList.toggleCompleted(1)
        const task = await this.todoList.tasks(1)
        assert.equal(task.completed, true)

        // Emitted event
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 1)
        assert.equal(event.completed, true)
    })
})
