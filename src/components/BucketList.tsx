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
import { mockS3Bucket, bucketUrl } from '../utils/modelK8s';
import { Button, Label } from '@patternfly/react-core';
import { Timestamp } from '../utils/timestamp';
import { useTranslation } from 'react-i18next';
import './style.css';

const NamespacePageContent = ({ namespace }: { namespace?: string }) => {
  const { t } = useTranslation('plugin__s3storage-console-plugin');
  const [errData, setErrData] = React.useState<string>();
  const [k8sModelBucket] = useK8sModel(
    getGroupVersionKindForResource(mockS3Bucket),
  );
  const [k8sUserStorage, setK8sUserStorage] = React.useState<any>();
  const [loaded, setLoaded] = React.useState(false);
  const loadError = '';
  const history = useHistory();

  const handleBucketCreate = () => {
    history.push(`/k8s/ns/${namespace}/${bucketUrl}/~new`);
  };

  const filters: RowFilter[] = [];

  const columns: TableColumn<K8sResourceKind>[] = [
    {
      title: t('Name'),
      id: 'name',
    },
    {
      title: t('Kind'),
      id: 'kind',
    },
    {
      title: t('Bucket Owner'),
      id: 'owner',
    },
    {
      title: t('Creation Date'),
      id: 'date',
    },
  ];

  const PodRow: React.FC<RowProps<K8sResourceKind>> = ({
    obj,
    activeColumnIDs,
  }) => {
    return (
      <>
        <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
          <Button
            variant="link"
            component="a"
            href={`/k8s/ns/${obj.metadata.namespace}/${bucketUrl}/${obj.metadata.name}`}
          >
            {obj.metadata.name}
          </Button>
        </TableData>
        <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
          {obj.kind}
        </TableData>
        <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
          <Label color="green">{obj.spec.s3UserRef}</Label>
        </TableData>
        <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
          <Timestamp timestamp={obj.metadata.creationTimestamp} />
        </TableData>
      </>
    );
  };

  const BucketsTable: React.FC<TableProps> = ({
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

  const k8sGetBuckets = () => {
    k8sGet({
      model: k8sModelBucket,
      ns: namespace,
    })
      .then((response: any) => {
        setLoaded(true);
        setK8sUserStorage(response.items);
      })
      .catch((e) => {
        setErrData(e.message);
        console.error(e);
      });
  };

  React.useEffect(() => {
    k8sGetBuckets();
  }, [namespace]);

  return (
    <>
      <ListPageHeader title={t('Bucket Management')}>
        <Button component="a" onClick={handleBucketCreate}>
          {t('Create Bucket')}
        </Button>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter
          data={data}
          loaded={loaded}
          rowFilters={filters}
          onFilterChange={onFilterChange}
        />
        <BucketsTable
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

const BucketList: React.FC<ListPageProps> = ({ match }) => {
  const { ns } = match?.params;
  const activeNamespace = ns || 'all-namespaces';

  return (
    <React.Fragment>
      <NamespacePageContent namespace={activeNamespace} />
    </React.Fragment>
  );
};

export default BucketList;
