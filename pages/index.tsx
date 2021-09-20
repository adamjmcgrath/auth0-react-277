import type { NextPage } from 'next'
import { Auth0Provider as BaseAuth0Provider, Auth0ProviderOptions, useAuth0, Auth0ContextInterface } from "@auth0/auth0-react";
import React, { useEffect } from "react";

export interface Props extends Auth0ProviderOptions {
  children: React.ReactNode;
}

const Auth0Provider = ({ children, ...props }: Props): React.ReactElement => {
  const options: Auth0ProviderOptions = {
    ...props,
    redirectUri: typeof window !== "undefined" ? window.location.origin : undefined,
    cacheLocation: "localstorage",
  };
  return <BaseAuth0Provider {...options}>{children}</BaseAuth0Provider>;
};


interface RenderProp {
  logout: Auth0ContextInterface["logout"];
}

export interface Props {
  children: { ({ logout }: RenderProp): React.ReactNode };
}

const AuthenticationWrapper = (): React.ReactElement => {
  const { isAuthenticated, isLoading, loginWithRedirect, user, error } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !error) {
      loginWithRedirect({ appState: { returnTo: "/" } });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, error]);

  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        isAuthenticated && (
          <>
            Hello {user?.name}
          </>
        )
      )}
    </>
  );
};



const Home: NextPage = () => {
  return (
    <Auth0Provider clientId="wLSIP47wM39wKdDmOj6Zb5eSEw3JVhVp" domain="brucke.auth0.com">
      <AuthenticationWrapper/>
    </Auth0Provider>
  )
}

export default Home
