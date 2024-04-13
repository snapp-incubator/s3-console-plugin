import { userClaimUrl } from '../utils/modelK8s';

function objectTransform(response) {
  const transformedResponse = [];

  response.items.forEach((item) => {
    const { kind, metadata, spec } = item;
    const url = `/k8s/ns/${metadata.namespace}/${userClaimUrl}/${metadata.name}`;
    const transformedItem = {
      kind,
      url,
      owner: 'self',
      metadata: { name: metadata.name },
      spec: {
        s3UserClass: spec.s3UserClass,
        adminSecret: spec.adminSecret,
        accessSecret: spec.adminSecret,
      },
    };
    transformedResponse.push(transformedItem);

    if (spec.subusers) {
      spec.subusers.forEach((user) => {
        const subuserUrl = `/k8s/ns/${metadata.namespace}/secrets/${metadata.name}-${user}`;

        const subuserItem = {
          kind: 'subuser',
          url: subuserUrl,
          owner: metadata.name,
          metadata: { name: user },
          spec: {
            s3UserClass: spec.s3UserClass,
            adminSecret: `${metadata.name}-${user}`,
            accessSecret: `${metadata.name}-${user}`,
          },
        };

        transformedResponse.push(subuserItem);
      });
    }
  });

  return transformedResponse;
}

export default objectTransform;
