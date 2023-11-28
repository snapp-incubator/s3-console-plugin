# OpenShift S3 Operator Plugin

At Snapp!, we leverage Ceph object storage to provide users with the seamless functionality of S3. Our plugin ensures a user-friendly experience by simplifying the management of users and buckets within the Openshift.

## Development

In one terminal window, run:

1. `yarn install`
2. `yarn run start`

In another terminal window, run:

1. `oc login` (requires [oc](https://console.redhat.com/openshift/downloads) and an [OpenShift cluster](https://console.redhat.com/openshift/create))
2. `yarn run start-console` (requires [Docker](https://www.docker.com) or [podman 3.2.0+](https://podman.io))
