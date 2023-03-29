export const JobsListHeaders = (isMobile: boolean) => [
  {
    text: 'Name',
    align: 'left',
    sortable: true,
    value: 'name',
    isShowOnMobile: true,
    class: 'text-left text-subtitle-2 font-weight-bold'
  },

  { text: 'Runs', sortable: false, value: 'suuid', isShowOnMobile: false, class: 'text-left text-subtitle-2 font-weight-bold' },
  {
    text: 'Status',
    value: 'status',
    sortable: false,
    isShowOnMobile: true,
    class: 'text-left text-subtitle-2 font-weight-bold',
    width: isMobile ? '35%' : ''
  }
]
