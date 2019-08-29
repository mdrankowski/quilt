import {useContext} from 'react';
import Cookies from 'cookies';
import {CspDirective, StatusCode} from '@shopify/network';
import {useServerEffect} from '@shopify/react-effect';

import {NetworkContext} from './context';
import {NetworkManager} from './manager';

export function useNetworkEffect(perform: (network: NetworkManager) => void) {
  const network = useContext(NetworkContext);

  useServerEffect(() => {
    if (network != null) {
      return perform(network);
    }
  }, network ? network.effect : undefined);
}

export function useCspDirective(
  directive: CspDirective,
  source: string | string[] | boolean,
) {
  useNetworkEffect(network => network.addCspDirective(directive, source));
}

export function useRequestHeader(header: string) {
  const network = useContext(NetworkContext);
  return network ? network.getHeader(header) : undefined;
}

export function useHeader(header: string, value: string) {
  useNetworkEffect(network => network.setHeader(header, value));
}

export function useStatus(code: StatusCode) {
  useNetworkEffect(network => network.addStatusCode(code));
}

export function useRedirect(url: string, status?: StatusCode) {
  useNetworkEffect(network => network.redirectTo(url, status));
}

export function useCookie(
  cookie: string,
): [string | undefined, (value: string, options?: Cookies.SetOption) => void] {
  const network = useContext(NetworkContext);
  const initialValue = network ? network.getCookie(cookie) : undefined;

  const setCookie = (value: string, options?: Cookies.SetOption) => {
    if (!network) {
      return;
    }

    network.setCookie(cookie, value, options);
  };

  return [initialValue, setCookie];
}
