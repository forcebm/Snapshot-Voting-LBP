import { getAddress } from '@ethersproject/address';
import { getDelegatesBySpace } from '../utils';

// delegations with overrides
export async function getDelegations(space, network, addresses, snapshot) {
  const addressesLc = addresses.map((addresses) => addresses.toLowerCase());
  const delegatesBySpace = await getDelegatesBySpace(network, space, snapshot);

  const delegations = delegatesBySpace.filter(
    (delegation: any) =>
      addressesLc.includes(delegation.delegate) &&
      !addressesLc.includes(delegation.delegator)
  );
  if (!delegations) return {};

  const delegationsReverse = {};
  delegations.forEach(
    (delegation: any) =>
      (delegationsReverse[delegation.delegator] = delegation.delegate)
  );
  delegations
    .filter((delegation: any) => delegation.space !== '')
    .forEach(
      (delegation: any) =>
        (delegationsReverse[delegation.delegator] = delegation.delegate)
    );

  return Object.fromEntries(
    addresses.map((address) => [
      address,
      Object.entries(delegationsReverse)
        .filter(([, delegate]) => address.toLowerCase() === delegate)
        .map(([delegator]) => getAddress(delegator))
    ])
  );
}

export async function getDelegationsData(space, network, addresses, snapshot) {
  const delegatesBySpace = await getDelegatesBySpace(network, space, snapshot);
  const delegationsReverse = {};
  delegatesBySpace.forEach(
    (delegation: any) =>
      (delegationsReverse[delegation.delegator] = delegation.delegate)
  );
  delegatesBySpace
    .filter((delegation: any) => delegation.space !== '')
    .forEach(
      (delegation: any) =>
        (delegationsReverse[delegation.delegator] = delegation.delegate)
    );

  return {
    delegations: Object.fromEntries(
      addresses.map((address) => [
        address,
        Object.entries(delegationsReverse)
          .filter(([, delegate]) => address.toLowerCase() === delegate)
          .map(([delegator]) => getAddress(delegator))
      ])
    ),
    allDelegators: Object.keys(delegationsReverse).map((delegator) =>
      getAddress(delegator)
    )
  };
}
