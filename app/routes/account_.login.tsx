import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Form, Link, useActionData, type MetaFunction} from '@remix-run/react';

type ActionResponse = {
  error: string | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'CodersBrew | Login'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account');
  }
  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {session, storefront} = context;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const form = await request.formData();
    const email = String(form.has('email') ? form.get('email') : '');
    const password = String(form.has('password') ? form.get('password') : '');
    const validInputs = Boolean(email && password);

    if (!validInputs) {
      throw new Error('Please provide both an email and a password.');
    }

    const {customerAccessTokenCreate} = await storefront.mutate(
      LOGIN_MUTATION,
      {
        variables: {
          input: {email, password},
        },
      },
    );

    if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      throw new Error(customerAccessTokenCreate?.customerUserErrors[0].message);
    }

    const {customerAccessToken} = customerAccessTokenCreate;
    session.set('customerAccessToken', customerAccessToken);

    return redirect('/account');
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
}

export default function Login() {
  const data = useActionData<ActionResponse>();
  const error = data?.error || null;

  return (
    <div className=' grid place-content-center'>
      <div className="login border-4 rounded border-[var(--theme-base-color)] m-4 p-5 text-center">
      <h1>Sign in.</h1>
      <Form method="POST" className='text-left'>
        <fieldset>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            aria-label="Password"
            minLength={8}
            required
          />
        </fieldset>
        {error ? (
          <p>
            <mark>
              <small>{error}</small>
            </mark>
          </p>
        ) : (
          <br />
        )}
        <button className='w-full text-center p-2 bg-[var(--theme-base-color)] text-[var(--theme-accent-color)] rounded ' type="submit">Sign in</button>
      </Form>
      <br />
      <div>
        <p>
          <Link to="/account/recover">Forgot password →</Link>
        </p>
        <p>
          <Link to="/account/register">Register →</Link>
        </p>
      </div>
    </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const LOGIN_MUTATION = `#graphql
  mutation login($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
` as const;
