import { createWrapper } from '../../utils/createComponent'
import WorkspaceToolbar from '@/features/workspace/components/workspace/WorkspaceToolbar.vue'

describe('WorkspaceToolbar.vue', () => {
  it('should render empty workspace title on load component', async () => {
    const { wrapper } = createWrapper(WorkspaceToolbar)
    expect(wrapper.find('.v-toolbar__title').text()).toBe('')
    wrapper.destroy()
  })

  it('should render workspace title', async () => {
    const { wrapper, store } = createWrapper(
      WorkspaceToolbar,
      {
        propsData: {
          title: 'Askanna'
        }
      },
      {
        state: {
          workspace: {
            uuid: '1',
            short_uuid: '2',
            name: '3',
            status: '',
            created: '',
            modified: '',
            title: 'Askanna',
            description: ''
          }
        }
      }
    )
    expect(wrapper.find('.v-toolbar__title').text()).toBe('Askanna')
    wrapper.destroy()
  })

  it('should change workspace view to list on click menu settings', async () => {
    const { wrapper, store } = createWrapper(WorkspaceToolbar)
    store.dispatch = jest.fn()

    const $menuActivateBtn = wrapper.find('[data-test="workspace-menu-activate-btn"]')
    await $menuActivateBtn.trigger('click')
    const $menu = wrapper.find('.v-menu__content')

    expect($menu.classes()).toContain('menuable__content__active')

    await wrapper.find('[data-test="view-list"]').trigger('click')

    expect(store.dispatch).toHaveBeenCalledWith('workspace/changeSettings', {
      projectView: 1
    })
    wrapper.destroy()
  })
})
