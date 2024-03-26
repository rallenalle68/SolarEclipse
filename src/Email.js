import * as React from 'react';
import { Html, Text, Link } from '@react-email/components';

export const SignUpEmail = () => {
    return (
        <Html lang="en">
          <Text>Thank you for signing up your account for Gannon University Solar Eclipse Quiz Game</Text>
          <Link href='/'>Link to the game</Link>
        </Html>
      );
}