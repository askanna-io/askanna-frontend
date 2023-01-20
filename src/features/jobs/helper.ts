export const JobsListHeaders = (isMobile: boolean) => [
  {
    text: 'Name',
    align: 'left',
    sortable: true,
    value: 'name',
    isShowOnMobile: true,
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  },

  { text: 'Runs', sortable: false, value: 'suuid', isShowOnMobile: false, class: 'text-left text-subtitle-2 font-weight-bold h-20' },
  {
    text: 'Status',
    value: 'status',
    sortable: false,
    isShowOnMobile: true,
    class: 'text-left text-subtitle-2 font-weight-bold h-20',
    width: isMobile ? '35%' : ''
  }
]
