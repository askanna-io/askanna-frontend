// Generated by 'unplugin-auto-import'
export {}
declare global {
  const EffectScope: typeof import('vue')['EffectScope']
  const FINISHED_STATUSES: typeof import('./features/run/types')['FINISHED_STATUSES']
  const InvitationModel: typeof import('./features/people/types')['InvitationModel']
  const JobsListHeaders: typeof import('./features/jobs/helper')['JobsListHeaders']
  const PACKAGES_STORE: typeof import('./features/packages/types')['PACKAGES_STORE']
  const PEOPLE_STORE: typeof import('./features/people/types')['PEOPLE_STORE']
  const PERMISSIONS_LABELS: typeof import('./features/workspace/types')['PERMISSIONS_LABELS']
  const PROJECT_STORE: typeof import('./features/project/types')['PROJECT_STORE']
  const PersonModel: typeof import('./features/people/types')['PersonModel']
  const ProjectModel: typeof import('./features/project/types')['ProjectModel']
  const ProjectVisibility: typeof import('./features/project/types')['ProjectVisibility']
  const RUNIFO_VARIABLES_STORE: typeof import('./features/run-variables/types')['RUNIFO_VARIABLES_STORE']
  const VARIABLES_STORE: typeof import('./features/variables/types')['VARIABLES_STORE']
  const VariableModel: typeof import('./features/variables/types')['VariableModel']
  const WORKSPACE_STORE: typeof import('./features/workspace/types')['WORKSPACE_STORE']
  const WorkspaceVisibility: typeof import('./features/workspace/useWorkspaceStore')['WorkspaceVisibility']
  const compareItems: typeof import('./features/compare-runs/helper')['compareItems']
  const computed: typeof import('vue')['computed']
  const config: typeof import('./features/workspaces/config')['default']
  const createApp: typeof import('vue')['createApp']
  const customRef: typeof import('vue')['customRef']
  const defaultWorkspace: typeof import('./features/workspace/useWorkspaceStore')['defaultWorkspace']
  const defineAsyncComponent: typeof import('vue')['defineAsyncComponent']
  const defineComponent: typeof import('vue')['defineComponent']
  const effectScope: typeof import('vue')['effectScope']
  const getCurrentInstance: typeof import('vue')['getCurrentInstance']
  const getCurrentScope: typeof import('vue')['getCurrentScope']
  const h: typeof import('vue')['h']
  const inject: typeof import('vue')['inject']
  const isProxy: typeof import('vue')['isProxy']
  const isReactive: typeof import('vue')['isReactive']
  const isReadonly: typeof import('vue')['isReadonly']
  const isRef: typeof import('vue')['isRef']
  const jobRoutes: typeof import('./features/job/config')['jobRoutes']
  const jobsRoutes: typeof import('./features/jobs/config')['jobsRoutes']
  const markRaw: typeof import('vue')['markRaw']
  const nextTick: typeof import('vue')['nextTick']
  const onActivated: typeof import('vue')['onActivated']
  const onBeforeMount: typeof import('vue')['onBeforeMount']
  const onBeforeUnmount: typeof import('vue')['onBeforeUnmount']
  const onBeforeUpdate: typeof import('vue')['onBeforeUpdate']
  const onDeactivated: typeof import('vue')['onDeactivated']
  const onErrorCaptured: typeof import('vue')['onErrorCaptured']
  const onMounted: typeof import('vue')['onMounted']
  const onRenderTracked: typeof import('vue')['onRenderTracked']
  const onRenderTriggered: typeof import('vue')['onRenderTriggered']
  const onScopeDispose: typeof import('vue')['onScopeDispose']
  const onServerPrefetch: typeof import('vue')['onServerPrefetch']
  const onUnmounted: typeof import('vue')['onUnmounted']
  const onUpdated: typeof import('vue')['onUpdated']
  const packageRoutes: typeof import('./features/package/config')['packageRoutes']
  const peopleRoutes: typeof import('./features/people/config')['peopleRoutes']
  const projectRoutes: typeof import('./features/project/config')['projectRoutes']
  const provide: typeof import('vue')['provide']
  const reactive: typeof import('vue')['reactive']
  const readonly: typeof import('vue')['readonly']
  const ref: typeof import('vue')['ref']
  const resolveComponent: typeof import('vue')['resolveComponent']
  const runRoutes: typeof import('./features/run/config')['runRoutes']
  const runsRoutes: typeof import('./features/runs/config')['runsRoutes']
  const shallowReactive: typeof import('vue')['shallowReactive']
  const shallowReadonly: typeof import('vue')['shallowReadonly']
  const shallowRef: typeof import('vue')['shallowRef']
  const toRaw: typeof import('vue')['toRaw']
  const toRef: typeof import('vue')['toRef']
  const toRefs: typeof import('vue')['toRefs']
  const triggerRef: typeof import('vue')['triggerRef']
  const unref: typeof import('vue')['unref']
  const useAttrs: typeof import('vue')['useAttrs']
  const useAuthStore: typeof import('./features/auth/useAuthStore')['useAuthStore']
  const useBreadcrumbs: typeof import('./composables/useBreadcrumbs')['default']
  const useCapitalize: typeof import('./composables/useCapitalize')['default']
  const useChartDownload: typeof import('./features/charts/useChartDownload')['default']
  const useChartLegend: typeof import('./features/charts/useChartLegend')['default']
  const useChartStore: typeof import('./features/charts/useChartStore')['useChartStore']
  const useCompareRunsStore: typeof import('./features/compare-runs/useCompareRunsStore')['useCompareRunsStore']
  const useCopy: typeof import('./composables/useCopy')['default']
  const useCronstrue: typeof import('./composables/useCronstrue')['default']
  const useCssModule: typeof import('vue')['useCssModule']
  const useCssVars: typeof import('vue')['useCssVars']
  const useEditorStore: typeof import('./composables/store/useEditorStore')['useEditorStore']
  const useFileExtension: typeof import('./composables/useFileExtension')['default']
  const useFileStore: typeof import('./features/file/useFileStore')['useFileStore']
  const useForceFileDownload: typeof import('./composables/useForceFileDownload')['default']
  const useGeneralStore: typeof import('./composables/store/useGeneralStore')['useGeneralStore']
  const useGroupArray: typeof import('./composables/useGroupArray')['default']
  const useImageUrlToBase64: typeof import('./composables/useImageUrlToBase64')['default']
  const useInterval: typeof import('./composables/useInterval')['default']
  const useJobStore: typeof import('./features/job/useJobStore')['useJobStore']
  const useJobsStore: typeof import('./features/jobs/useJobsStore')['useJobsStore']
  const useLineChart: typeof import('./features/charts/useLineChart')['default']
  const useLineNumber: typeof import('./components/highlight/useLineNumber')['default']
  const useLogger: typeof import('./composables/useLogger')['useLogger']
  const useMapMetrics: typeof import('./features/compare-runs/useMapMetrics')['default']
  const useMetricStore: typeof import('./features/metric/useMetricStore')['useMetricStore']
  const useMobileStore: typeof import('./composables/store/useMobileStore')['useMobileStore']
  const useMoment: typeof import('./composables/useMoment')['default']
  const useNumeral: typeof import('./composables/useNumeral')['default']
  const usePackageBreadcrumbs: typeof import('./composables/usePackageBreadcrumbs')['default']
  const usePackageStore: typeof import('./features/package/usePackageStore')['usePackageStore']
  const usePackagesStore: typeof import('./features/packages/usePackagesStore')['usePackagesStore']
  const usePeopleStore: typeof import('./features/people/usePeopleStore')['usePeopleStore']
  const usePermission: typeof import('./composables/usePermission')['default']
  const usePrepareAccount: typeof import('./features/auth/usePrepareAccount')['default']
  const usePrettyJSON: typeof import('./composables/usePrettyJSON')['default']
  const useProject: typeof import('./features/project/useProject')['default']
  const useProjectStore: typeof import('./features/project/useProjectStore')['useProjectStore']
  const useProjectsStore: typeof import('./features/projects/useProjectsStore')['useProjectsStore']
  const useQuery: typeof import('./composables/useQuery')['default']
  const useResumable: typeof import('./composables/resumable/useResumable.js')['default']
  const useRoute: typeof import('vue-router')['useRoute']
  const useRouter: typeof import('vue-router')['useRouter']
  const useRouterAskAnna: typeof import('./composables/useRouterAskAnna')['default']
  const useRunStore: typeof import('./features/run/useRunStore')['useRunStore']
  const useRunVariablesStore: typeof import('./features/run-variables/useRunVariablesStore')['useRunVariablesStore']
  const useRunsStore: typeof import('./features/runs/useRunsStore')['useRunsStore']
  const useSanitizeHTML: typeof import('./composables/useSanitizeHTML')['default']
  const useSizeHumanize: typeof import('./composables/useSizeHumanize')['default']
  const useSlicedText: typeof import('./composables/useSlicedText')['default']
  const useSlots: typeof import('vue')['useSlots']
  const useSnackBar: typeof import('./components/snackBar/useSnackBar')['useSnackBar']
  const useSortFilter: typeof import('./composables/useSortFilter')['default']
  const useSortFilterHelper: typeof import('./composables/useSortFilterHelper')['default']
  const useStartSlicedText: typeof import('./composables/useStartSlicedText')['default']
  const useTitle: typeof import('./composables/useTitle')['default']
  const useTriggerFileDownload: typeof import('./composables/useTriggerFileDownload')['default']
  const useUploadStatus: typeof import('./components/uploadStatus/useUploadStatus')['useUploadStatus']
  const useUserStore: typeof import('./features/user/useUserStore')['useUserStore']
  const useValidationRules: typeof import('./composables/useValidationRules')['default']
  const useVariablesStore: typeof import('./features/variables/useVariablesStore')['useVariablesStore']
  const useWindowSize: typeof import('./composables/useWindowSize')['default']
  const useWorkspaceProjectsStore: typeof import('./features/workspace/useWorkspaceProjectsStore')['useWorkspaceProjectsStore']
  const useWorkspaceStore: typeof import('./features/workspace/useWorkspaceStore')['useWorkspaceStore']
  const useWorkspacesStore: typeof import('./features/workspaces/useWorkspacesStore')['useWorkspacesStore']
  const watch: typeof import('vue')['watch']
  const watchEffect: typeof import('vue')['watchEffect']
  const watchPostEffect: typeof import('vue')['watchPostEffect']
  const watchSyncEffect: typeof import('vue')['watchSyncEffect']
}
// for vue template auto import
import { UnwrapRef } from 'vue'
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    readonly EffectScope: UnwrapRef<typeof import('vue')['EffectScope']>
    readonly FINISHED_STATUSES: UnwrapRef<typeof import('./features/run/types')['FINISHED_STATUSES']>
    readonly InvitationModel: UnwrapRef<typeof import('./features/people/types')['InvitationModel']>
    readonly JobsListHeaders: UnwrapRef<typeof import('./features/jobs/helper')['JobsListHeaders']>
    readonly PACKAGES_STORE: UnwrapRef<typeof import('./features/packages/types')['PACKAGES_STORE']>
    readonly PEOPLE_STORE: UnwrapRef<typeof import('./features/people/types')['PEOPLE_STORE']>
    readonly PERMISSIONS_LABELS: UnwrapRef<typeof import('./features/workspace/types')['PERMISSIONS_LABELS']>
    readonly PROJECT_STORE: UnwrapRef<typeof import('./features/project/types')['PROJECT_STORE']>
    readonly PersonModel: UnwrapRef<typeof import('./features/people/types')['PersonModel']>
    readonly ProjectModel: UnwrapRef<typeof import('./features/project/types')['ProjectModel']>
    readonly ProjectVisibility: UnwrapRef<typeof import('./features/project/types')['ProjectVisibility']>
    readonly RUNIFO_VARIABLES_STORE: UnwrapRef<typeof import('./features/run-variables/types')['RUNIFO_VARIABLES_STORE']>
    readonly VARIABLES_STORE: UnwrapRef<typeof import('./features/variables/types')['VARIABLES_STORE']>
    readonly VariableModel: UnwrapRef<typeof import('./features/variables/types')['VariableModel']>
    readonly WORKSPACE_STORE: UnwrapRef<typeof import('./features/workspace/types')['WORKSPACE_STORE']>
    readonly WorkspaceVisibility: UnwrapRef<typeof import('./features/workspace/useWorkspaceStore')['WorkspaceVisibility']>
    readonly compareItems: UnwrapRef<typeof import('./features/compare-runs/helper')['compareItems']>
    readonly computed: UnwrapRef<typeof import('vue')['computed']>
    readonly config: UnwrapRef<typeof import('./features/workspaces/config')['default']>
    readonly createApp: UnwrapRef<typeof import('vue')['createApp']>
    readonly customRef: UnwrapRef<typeof import('vue')['customRef']>
    readonly defaultWorkspace: UnwrapRef<typeof import('./features/workspace/useWorkspaceStore')['defaultWorkspace']>
    readonly defineAsyncComponent: UnwrapRef<typeof import('vue')['defineAsyncComponent']>
    readonly defineComponent: UnwrapRef<typeof import('vue')['defineComponent']>
    readonly effectScope: UnwrapRef<typeof import('vue')['effectScope']>
    readonly getCurrentInstance: UnwrapRef<typeof import('vue')['getCurrentInstance']>
    readonly getCurrentScope: UnwrapRef<typeof import('vue')['getCurrentScope']>
    readonly h: UnwrapRef<typeof import('vue')['h']>
    readonly inject: UnwrapRef<typeof import('vue')['inject']>
    readonly isProxy: UnwrapRef<typeof import('vue')['isProxy']>
    readonly isReactive: UnwrapRef<typeof import('vue')['isReactive']>
    readonly isReadonly: UnwrapRef<typeof import('vue')['isReadonly']>
    readonly isRef: UnwrapRef<typeof import('vue')['isRef']>
    readonly jobRoutes: UnwrapRef<typeof import('./features/job/config')['jobRoutes']>
    readonly jobsRoutes: UnwrapRef<typeof import('./features/jobs/config')['jobsRoutes']>
    readonly markRaw: UnwrapRef<typeof import('vue')['markRaw']>
    readonly nextTick: UnwrapRef<typeof import('vue')['nextTick']>
    readonly onActivated: UnwrapRef<typeof import('vue')['onActivated']>
    readonly onBeforeMount: UnwrapRef<typeof import('vue')['onBeforeMount']>
    readonly onBeforeUnmount: UnwrapRef<typeof import('vue')['onBeforeUnmount']>
    readonly onBeforeUpdate: UnwrapRef<typeof import('vue')['onBeforeUpdate']>
    readonly onDeactivated: UnwrapRef<typeof import('vue')['onDeactivated']>
    readonly onErrorCaptured: UnwrapRef<typeof import('vue')['onErrorCaptured']>
    readonly onMounted: UnwrapRef<typeof import('vue')['onMounted']>
    readonly onRenderTracked: UnwrapRef<typeof import('vue')['onRenderTracked']>
    readonly onRenderTriggered: UnwrapRef<typeof import('vue')['onRenderTriggered']>
    readonly onScopeDispose: UnwrapRef<typeof import('vue')['onScopeDispose']>
    readonly onServerPrefetch: UnwrapRef<typeof import('vue')['onServerPrefetch']>
    readonly onUnmounted: UnwrapRef<typeof import('vue')['onUnmounted']>
    readonly onUpdated: UnwrapRef<typeof import('vue')['onUpdated']>
    readonly packageRoutes: UnwrapRef<typeof import('./features/package/config')['packageRoutes']>
    readonly peopleRoutes: UnwrapRef<typeof import('./features/people/config')['peopleRoutes']>
    readonly projectRoutes: UnwrapRef<typeof import('./features/project/config')['projectRoutes']>
    readonly provide: UnwrapRef<typeof import('vue')['provide']>
    readonly reactive: UnwrapRef<typeof import('vue')['reactive']>
    readonly readonly: UnwrapRef<typeof import('vue')['readonly']>
    readonly ref: UnwrapRef<typeof import('vue')['ref']>
    readonly resolveComponent: UnwrapRef<typeof import('vue')['resolveComponent']>
    readonly runRoutes: UnwrapRef<typeof import('./features/run/config')['runRoutes']>
    readonly runsRoutes: UnwrapRef<typeof import('./features/runs/config')['runsRoutes']>
    readonly shallowReactive: UnwrapRef<typeof import('vue')['shallowReactive']>
    readonly shallowReadonly: UnwrapRef<typeof import('vue')['shallowReadonly']>
    readonly shallowRef: UnwrapRef<typeof import('vue')['shallowRef']>
    readonly toRaw: UnwrapRef<typeof import('vue')['toRaw']>
    readonly toRef: UnwrapRef<typeof import('vue')['toRef']>
    readonly toRefs: UnwrapRef<typeof import('vue')['toRefs']>
    readonly triggerRef: UnwrapRef<typeof import('vue')['triggerRef']>
    readonly unref: UnwrapRef<typeof import('vue')['unref']>
    readonly useAttrs: UnwrapRef<typeof import('vue')['useAttrs']>
    readonly useAuthStore: UnwrapRef<typeof import('./features/auth/useAuthStore')['useAuthStore']>
    readonly useBreadcrumbs: UnwrapRef<typeof import('./composables/useBreadcrumbs')['default']>
    readonly useCapitalize: UnwrapRef<typeof import('./composables/useCapitalize')['default']>
    readonly useChartDownload: UnwrapRef<typeof import('./features/charts/useChartDownload')['default']>
    readonly useChartLegend: UnwrapRef<typeof import('./features/charts/useChartLegend')['default']>
    readonly useChartStore: UnwrapRef<typeof import('./features/charts/useChartStore')['useChartStore']>
    readonly useCompareRunsStore: UnwrapRef<typeof import('./features/compare-runs/useCompareRunsStore')['useCompareRunsStore']>
    readonly useCopy: UnwrapRef<typeof import('./composables/useCopy')['default']>
    readonly useCronstrue: UnwrapRef<typeof import('./composables/useCronstrue')['default']>
    readonly useCssModule: UnwrapRef<typeof import('vue')['useCssModule']>
    readonly useCssVars: UnwrapRef<typeof import('vue')['useCssVars']>
    readonly useEditorStore: UnwrapRef<typeof import('./composables/store/useEditorStore')['useEditorStore']>
    readonly useFileExtension: UnwrapRef<typeof import('./composables/useFileExtension')['default']>
    readonly useFileStore: UnwrapRef<typeof import('./features/file/useFileStore')['useFileStore']>
    readonly useForceFileDownload: UnwrapRef<typeof import('./composables/useForceFileDownload')['default']>
    readonly useGeneralStore: UnwrapRef<typeof import('./composables/store/useGeneralStore')['useGeneralStore']>
    readonly useGroupArray: UnwrapRef<typeof import('./composables/useGroupArray')['default']>
    readonly useImageUrlToBase64: UnwrapRef<typeof import('./composables/useImageUrlToBase64')['default']>
    readonly useInterval: UnwrapRef<typeof import('./composables/useInterval')['default']>
    readonly useJobStore: UnwrapRef<typeof import('./features/job/useJobStore')['useJobStore']>
    readonly useJobsStore: UnwrapRef<typeof import('./features/jobs/useJobsStore')['useJobsStore']>
    readonly useLineChart: UnwrapRef<typeof import('./features/charts/useLineChart')['default']>
    readonly useLineNumber: UnwrapRef<typeof import('./components/highlight/useLineNumber')['default']>
    readonly useLogger: UnwrapRef<typeof import('./composables/useLogger')['useLogger']>
    readonly useMapMetrics: UnwrapRef<typeof import('./features/compare-runs/useMapMetrics')['default']>
    readonly useMetricStore: UnwrapRef<typeof import('./features/metric/useMetricStore')['useMetricStore']>
    readonly useMobileStore: UnwrapRef<typeof import('./composables/store/useMobileStore')['useMobileStore']>
    readonly useMoment: UnwrapRef<typeof import('./composables/useMoment')['default']>
    readonly useNumeral: UnwrapRef<typeof import('./composables/useNumeral')['default']>
    readonly usePackageBreadcrumbs: UnwrapRef<typeof import('./composables/usePackageBreadcrumbs')['default']>
    readonly usePackageStore: UnwrapRef<typeof import('./features/package/usePackageStore')['usePackageStore']>
    readonly usePackagesStore: UnwrapRef<typeof import('./features/packages/usePackagesStore')['usePackagesStore']>
    readonly usePeopleStore: UnwrapRef<typeof import('./features/people/usePeopleStore')['usePeopleStore']>
    readonly usePermission: UnwrapRef<typeof import('./composables/usePermission')['default']>
    readonly usePrepareAccount: UnwrapRef<typeof import('./features/auth/usePrepareAccount')['default']>
    readonly usePrettyJSON: UnwrapRef<typeof import('./composables/usePrettyJSON')['default']>
    readonly useProject: UnwrapRef<typeof import('./features/project/useProject')['default']>
    readonly useProjectStore: UnwrapRef<typeof import('./features/project/useProjectStore')['useProjectStore']>
    readonly useProjectsStore: UnwrapRef<typeof import('./features/projects/useProjectsStore')['useProjectsStore']>
    readonly useQuery: UnwrapRef<typeof import('./composables/useQuery')['default']>
    readonly useResumable: UnwrapRef<typeof import('./composables/resumable/useResumable.js')['default']>
    readonly useRoute: UnwrapRef<typeof import('vue-router')['useRoute']>
    readonly useRouter: UnwrapRef<typeof import('vue-router')['useRouter']>
    readonly useRouterAskAnna: UnwrapRef<typeof import('./composables/useRouterAskAnna')['default']>
    readonly useRunStore: UnwrapRef<typeof import('./features/run/useRunStore')['useRunStore']>
    readonly useRunVariablesStore: UnwrapRef<typeof import('./features/run-variables/useRunVariablesStore')['useRunVariablesStore']>
    readonly useRunsStore: UnwrapRef<typeof import('./features/runs/useRunsStore')['useRunsStore']>
    readonly useSanitizeHTML: UnwrapRef<typeof import('./composables/useSanitizeHTML')['default']>
    readonly useSizeHumanize: UnwrapRef<typeof import('./composables/useSizeHumanize')['default']>
    readonly useSlicedText: UnwrapRef<typeof import('./composables/useSlicedText')['default']>
    readonly useSlots: UnwrapRef<typeof import('vue')['useSlots']>
    readonly useSnackBar: UnwrapRef<typeof import('./components/snackBar/useSnackBar')['useSnackBar']>
    readonly useSortFilter: UnwrapRef<typeof import('./composables/useSortFilter')['default']>
    readonly useSortFilterHelper: UnwrapRef<typeof import('./composables/useSortFilterHelper')['default']>
    readonly useStartSlicedText: UnwrapRef<typeof import('./composables/useStartSlicedText')['default']>
    readonly useTitle: UnwrapRef<typeof import('./composables/useTitle')['default']>
    readonly useTriggerFileDownload: UnwrapRef<typeof import('./composables/useTriggerFileDownload')['default']>
    readonly useUploadStatus: UnwrapRef<typeof import('./components/uploadStatus/useUploadStatus')['useUploadStatus']>
    readonly useUserStore: UnwrapRef<typeof import('./features/user/useUserStore')['useUserStore']>
    readonly useValidationRules: UnwrapRef<typeof import('./composables/useValidationRules')['default']>
    readonly useVariablesStore: UnwrapRef<typeof import('./features/variables/useVariablesStore')['useVariablesStore']>
    readonly useWindowSize: UnwrapRef<typeof import('./composables/useWindowSize')['default']>
    readonly useWorkspaceProjectsStore: UnwrapRef<typeof import('./features/workspace/useWorkspaceProjectsStore')['useWorkspaceProjectsStore']>
    readonly useWorkspaceStore: UnwrapRef<typeof import('./features/workspace/useWorkspaceStore')['useWorkspaceStore']>
    readonly useWorkspacesStore: UnwrapRef<typeof import('./features/workspaces/useWorkspacesStore')['useWorkspacesStore']>
    readonly watch: UnwrapRef<typeof import('vue')['watch']>
    readonly watchEffect: UnwrapRef<typeof import('vue')['watchEffect']>
    readonly watchPostEffect: UnwrapRef<typeof import('vue')['watchPostEffect']>
    readonly watchSyncEffect: UnwrapRef<typeof import('vue')['watchSyncEffect']>
  }
}
