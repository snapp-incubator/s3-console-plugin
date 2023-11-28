export const mockS3User = {
  apiVersion: 's3.snappcloud.io/v1alpha1',
  kind: 'S3UserClaim',
};

export const mockS3Bucket = {
  apiVersion: 's3.snappcloud.io/v1alpha1',
  kind: 'S3Bucket',
};

export const mockSecrets = {
  apiVersion: 'api/v1',
  kind: 'Secret',
};

export const userClaimUrl =
  'clusterserviceversions/s3-operator.v0.3.3/s3.snappcloud.io~v1alpha1~S3UserClaim';

export const bucketUrl =
  'clusterserviceversions/s3-operator.v0.3.3/s3.snappcloud.io~v1alpha1~S3Bucket';
