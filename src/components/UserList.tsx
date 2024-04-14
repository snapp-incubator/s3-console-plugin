import * as React from 'react';
import { useHistory } from 'react-router-dom';
import {
  ListPageHeader,
  ListPageBody,
  VirtualizedTable,
  useListPageFilter,
  K8sResourceKind,
  ListPageFilter,
  RowFilter,
  TableData,
  RowProps,
  TableColumn,
  k8sGet,
  useK8sModel,
  getGroupVersionKindForResource,
} from '@openshift-console/dynamic-plugin-sdk';

import { ListPageProps, TableProps } from '../utils/types';
import { mockS3User, mockSecrets, userClaimUrl } from '../utils/modelK8s';
import { Button, ClipboardCopy, Label } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import objectTransform from '../utils/objectTransform';

// global style
import './style.css';

const NamespacePageContent = ({ namespace }: { namespace?: string }) => {
  const { t } = useTranslation('plugin__s3storage-console-plugin');
  const [errData, setErrData] = React.useState<string>();
  const [k8sModelService] = useK8sModel(
    getGroupVersionKindForResource(mockS3User),
  );
  const [k8sUserStorage, setK8sUserStorage] = React.useState<any>();
  const [loaded, setLoaded] = React.useState(false);
  const [k8sModelSecret] = useK8sModel(
    getGroupVersionKindForResource(mockSecrets),
  );
  const loadError = '';
  const history = useHistory();

  const handleUserCreate = () => {
    history.push(`/k8s/ns/${namespace}/${userClaimUrl}/~new`);
  };

  const filters: RowFilter[] = [
    {
      filterGroupName: 'User List',
      type: 'user-list',
      reducer: (user) =>
        user.kind.includes('S3UserClaim') ? 'S3UserClaim' : 'subuser',
      filter: (input, user) =>
        !input.selected?.length ||
        input.selected.includes(
          user.kind.includes('S3UserClaim') ? 'S3UserClaim' : 'subuser',
        ),
      items: [
        { id: 'S3UserClaim', title: 'S3UserClaim' },
        { id: 'subuser', title: 'subuser' },
      ],
    },
  ];

  const columns: TableColumn<K8sResourceKind>[] = [
    {
      title: t('Name'),
      id: 'name',
    },
    {
      title: t('Owner'),
      id: 'owner',
    },
    {
      title: t('Type'),
      id: 'type',
    },
    {
      title: t('Access Key'),
      id: 'access-secret',
    },
    {
      title: t('Secret Key'),
      id: 'admin-secret',
    },
  ];

  const handleClipboard = async (event, text, type = 'secret-key') => {
    try {
      const response: any = await k8sGet({
        model: k8sModelSecret,
        ns: namespace,
        name: text,
      });
      switch (type) {
        case 'access-key':
          await navigator.clipboard.writeText(response.data.accessKey);
          break;
        case 'secret-key':
          await navigator.clipboard.writeText(response.data.secretKey);
      }
    } catch (error) {
      setErrData(error.message);
      console.error(error);
    }
  };

  const PodRow: React.FC<RowProps<any>> = ({ obj, activeColumnIDs }) => {
    return (
      <>
        <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
          <Button variant="link" component="a" href={obj.url}>
            {obj.metadata.name}
          </Button>
        </TableData>
        <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
          <Label color="green"> {obj.owner}</Label>
        </TableData>
        <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
          {obj.kind}
        </TableData>
        <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
          <ClipboardCopy
            hoverTip={t('Copy')}
            clickTip={t('Copied')}
            variant="inline-compact"
            onCopy={(event, text) => handleClipboard(event, text, 'access-key')}
          >
            {obj.spec.adminSecret}
          </ClipboardCopy>
        </TableData>
        <TableData id={columns[4].id} activeColumnIDs={activeColumnIDs}>
          <ClipboardCopy
            hoverTip={t('Copy')}
            clickTip={t('Copied')}
            variant="inline-compact"
            onCopy={(event, text) => handleClipboard(event, text, 'secret-key')}
          >
            {obj.spec.accessSecret}
          </ClipboardCopy>
        </TableData>
      </>
    );
  };

  const UsersTable: React.FC<TableProps> = ({
    data,
    unfilteredData,
    loaded,
    loadError,
  }) => {
    return (
      <VirtualizedTable<K8sResourceKind>
        data={data}
        unfilteredData={unfilteredData}
        loaded={loaded}
        loadError={loadError}
        columns={columns}
        Row={PodRow}
      />
    );
  };

  const [data, filteredData, onFilterChange] = useListPageFilter(
    k8sUserStorage,
    filters,
  );

  const k8sGetServices = () => {
    k8sGet({
      model: k8sModelService,
      ns: namespace,
    })
      .then((response: any) => {
        const transformResponse = objectTransform(response);
        setK8sUserStorage(transformResponse);
        setLoaded(true);
      })
      .catch((e) => {
        setErrData(e.message);
        console.error(e);
      });
  };

  React.useEffect(() => {
    k8sGetServices();
  }, [namespace]);

  return (
    <>
      <ListPageHeader title={t('User Management')}>
        <Button component="a" onClick={handleUserCreate}>
          {t('Create S3 User')}
        </Button>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter
          data={data}
          loaded={loaded}
          rowFilters={filters}
          onFilterChange={onFilterChange}
        />
        <UsersTable
          data={filteredData}
          unfilteredData={data}
          loaded={loaded}
          loadError={loadError}
        />
      </ListPageBody>
      {errData}
    </>
  );
};

const UserList: React.FC<ListPageProps> = ({ match }) => {
  const { ns } = match?.params;
  const activeNamespace = ns || 'all-namespaces';

  return (
    <React.Fragment>
      <NamespacePageContent namespace={activeNamespace} />
    </React.Fragment>
  );
};

export default UserList;
