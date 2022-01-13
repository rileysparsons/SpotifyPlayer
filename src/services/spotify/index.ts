
export function getPlayerState(accessToken: string) {
    return fetch(
        `https://api.spotify.com/v1/me/player`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
        }
      ).then((res: any) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.status as any);
        }
    });
}
