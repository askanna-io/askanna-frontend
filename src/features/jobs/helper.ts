export const JobsListHeaders = (isMobile: boolean) => [
  {
    text: 'Name',
    align: 'left',
    sortable: false,
    value: 'name',
    isShowOnMobile: true,
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  },
  { text: 'Runs', value: 'suuid', isShowOnMobile: false, class: 'text-left text-subtitle-2 font-weight-bold h-20' },
  {
    text: 'Status',
    value: 'status',
    isShowOnMobile: true,
    class: 'text-left text-subtitle-2 font-weight-bold h-20',
    width: isMobile ? '35%' : ''
  }
]
