export const WORKSPACE_STORE = 'workspace'

interface IPERMISSIONS_LABELS {
  [key: string]: string
}
export const PERMISSIONS_LABELS: IPERMISSIONS_LABELS = {
  askannaMe: 'askanna.me',
  askannaAdmin: 'askanna.admin',
  askannaMember: 'askanna.member',

  workspaceList: 'workspace.list',
  workspaceCreate: 'workspace.create',
  workspaceRemove: 'workspace.remove',
  workspaceInfoView: 'workspace.info.view',
  workspaceInfoEdit: 'workspace.info.edit',
  workspacePeopleList: 'workspace.people.list',
  workspacePeopleInviteCreate: 'workspace.people.invite.create',
  workspacePeopleInviteRemove: 'workspace.people.invite.remove',
  workspacePeopleInviteResend: 'workspace.people.invite.resend',
  workspacePeopleEdit: 'workspace.people.edit',
  workspacePeopleRemove: 'workspace.people.remove',

  projectList: 'project.list',
  projectCreate: 'project.create',
  projectInfoView: 'project.info.view',
  projectInfoEdit: 'project.info.edit',
  projectRemove: 'project.remove',
  projectCodeList: 'project.code.list',
  projectCodeCreate: 'project.code.create',
  projectJobList: 'project.job.list',
  projectJobCreate: 'project.job.create',
  projectJobEdit: 'project.job.edit',
  projectJobRemove: 'project.job.remove',
  projectRunList: 'project.run.list',
  projectRunCreate: 'project.run.create',
  projectRunEdit: 'project.run.edit',
  projectRunRemove: 'project.run.remove',

  variableList: 'variable.list',
  variableCreate: 'variable.create',
  variableEdit: 'variable.edit',
  variableRemove: 'variable.remove'
}