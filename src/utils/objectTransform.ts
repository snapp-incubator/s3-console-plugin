import { userClaimUrl } from '../utils/modelK8s';

function objectTransform(response) {
  const newResponse = [];
  response.items.forEach((item) => {
    const newItem = {
      kind: item.kind,
      url: `/k8s/ns/${item.metadata.namespace}/${userClaimUrl}/${item.metadata.name}`,
      owner: 'self',
      metadata: {
        name: item.metadata.name,
      },
      spec: {
        s3UserClass: item.spec.s3UserClass,
        adminSecret: item.spec.adminSecret,
        accessSecret: item.spec.adminSecret,
      },
    };
    newResponse.push(newItem);
    item.spec.subusers.forEach((user) => {
      newResponse.push({
        kind: 'subuser',
        url: `/k8s/ns/${item.metadata.namespace}/secrets/${item.metadata.name}-${user}`,
        owner: item.metadata.name,
        metadata: {
          name: user,
        },
        spec: {
          s3UserClass: item.spec.s3UserClass,
          adminSecret: `${item.metadata.name}-${user}`,
          accessSecret: `${item.metadata.name}-${user}`,
        },
      });
    });
  });
  return newResponse;
}

export default objectTransform;
