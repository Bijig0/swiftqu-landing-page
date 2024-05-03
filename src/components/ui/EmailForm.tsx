// @ts-ignore
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import React, { useState } from 'react';
import { z } from 'zod';
import type { Form } from '~/types';

type Props = Omit<Form, 'button'> & { children: any };

const emailFormSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  additionalDetails: z.string().optional(),
  disclaimer: z.boolean(),
});

const EmailForm = (props: Props) => {
  const { inputs, textarea, disclaimer, children, description } = props;
  const [emailJSResponse, setEmailJSResponse] = useState<EmailJSResponseStatus>({ text: '', status: -1 });
  const [validationFailed, setValidationFailed] = useState<boolean | null>(null);
  const isEmailSent = emailJSResponse.status !== -1;
  const isEmailSendSuccess = emailJSResponse.status === 200;
  const isEmailSendFailed = emailJSResponse.status !== 200 && emailJSResponse.status !== -1;
  console.log({ isEmailSent, isEmailSendSuccess, isEmailSendFailed });
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e);
    console.log('run');
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const unsafeFormInfo = {
      // @ts-ignore
      disclaimer: e.target.elements.disclaimer.checked,
      // @ts-ignore

      additionalDetails: e.target.elements.textarea.value,
      // @ts-ignore

      email: e.target.elements.email.value,
      // @ts-ignore

      name: e.target.elements.name.value,
    };

    const parsedFormInfo = emailFormSchema.safeParse(unsafeFormInfo);

    if (!parsedFormInfo.success) {
      setValidationFailed(true);
      return;
    } else if (parsedFormInfo.success) {
      setValidationFailed(false);
    }

    const sendEmail = async (inputs: any) => {
      const templateParams = {
        to_name: 'Brady',
        from_name: 'Tutoring',
        subject: 'New Tutoring Person From Contact us',
        message: `New From Contact Us, details: ${JSON.stringify(inputs)}`,
      };

      const serviceId = 'service_010xydf';
      const templateName = 'template_1dcm4rn';
      const publicKey = 'Yd6r5t5etWEKD3GNh';
      return emailjs.send(serviceId, templateName, templateParams, publicKey);
    };

    try {
      const response = await sendEmail(unsafeFormInfo);
      console.log({ response });
      setEmailJSResponse(response);
    } catch (error) {
      const emailJSError = error as EmailJSResponseStatus;
      setEmailJSResponse(emailJSError);
    }
  };

  const renderAlert = () => {
    if (!isEmailSent) {
      return null;
    }
    if (isEmailSendSuccess) {
      return (
        <>
          <div className="mt-4"></div>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Email sent successfully! </strong>
            <span className="block sm:inline">A representative will be in touch soon</span>
          </div>
        </>
      );
    } else if (isEmailSendFailed) {
      return (
        <>
          <div className="mt-4"></div>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">An error occurred </strong>
            <span className="block sm:inline">
              Error: {emailJSResponse.text} Status Code: {emailJSResponse.status}
            </span>
            <br />
            <span className="block sm:inline">Please report this to the admin admin@swiftqu.com</span>
          </div>
        </>
      );
    }
  };

  return (
    <form id="email-form" onSubmit={onSubmit}>
      {inputs &&
        inputs.map(
          ({ type = 'text', name, label = '', autocomplete = 'on', placeholder = '' }) =>
            name && (
              <div className="mb-6">
                {label && (
                  <label
                    htmlFor={name}
                    className="block text-sm font-medium after:content-['*'] after:ml-0.5 after:text-red-500"
                  >
                    {label}
                  </label>
                )}
                <input
                  type={type}
                  name={name}
                  id={name}
                  autoComplete={autocomplete}
                  placeholder={placeholder}
                  className="py-3 px-4 block w-full text-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"
                />
              </div>
            )
        )}

      {textarea && (
        <div>
          <label htmlFor="textarea" className="block text-sm font-medium">
            {textarea.label}
          </label>
          <textarea
            id="textarea"
            name="textarea"
            rows={textarea.rows ? textarea.rows : 4}
            placeholder={textarea.placeholder}
            className="py-3 px-4 block w-full text-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"
          />
        </div>
      )}

      {disclaimer && (
        <div className="mt-3 flex items-start">
          <div className="flex mt-0.5">
            <input
              id="disclaimer"
              name="disclaimer"
              type="checkbox"
              className="cursor-pointer mt-1 py-3 px-4 block w-full text-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900"
            />
          </div>
          <div className="ml-3">
            <label
              htmlFor="disclaimer"
              className="cursor-pointer after:content-['*'] after:ml-0.5 after:text-red-500 select-none text-sm text-gray-600 dark:text-gray-400"
            >
              {disclaimer.label}
            </label>
          </div>
        </div>
      )}

      {children && <div className="mt-10 grid">{children}</div>}

      {validationFailed === true ? (
        <p className="mt-4 text-red-700 after:content-['*'] after:ml-0.5">Missing required fields</p>
      ) : null}

      {description && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      )}
      {renderAlert()}
    </form>
  );
};

export default EmailForm;
