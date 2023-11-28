import { match as RMatch } from 'react-router-dom';
import { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

export type TableProps = {
  data: K8sResourceKind[];
  unfilteredData: K8sResourceKind[];
  loaded: boolean;
  loadError: any;
};

export type ListPageProps = {
  match: RMatch<{
    ns?: string;
  }>;
};
