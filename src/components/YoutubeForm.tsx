import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";

let renderCount = 0;

type FormValues = {
  username: string;
  email: string;
  channel: string;
  social: {
    twitter: string;
    facebook: string;
  };
  phoneNumbers: string[];
  phNumbers: {
    number: string;
  }[];
  age: number;
  dob: Date;
};

export const YouTubeForm = () => {
  renderCount += 1;
  const form = useForm<FormValues>({
    defaultValues: {
      username: "batman",
      email: "",
      channel: "",
      social: {
        twitter: "",
        facebook: "",
      },
      phoneNumbers: ["", ""],
      phNumbers: [{ number: "" }],
      age: 0,
      dob: new Date(),
    },
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
    trigger,
  } = form;
  // const { errors, dirtyFields, touchedFields, isDirty, submitCount } = formState;
  // console.log({ touchedFields, dirtyFields, isDirty });
  const {
    errors,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
  } = formState;

  const { fields, append, remove } = useFieldArray({
    name: "phNumbers",
    control,
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted", data);
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.log("Form errors", errors);
  };

  // This way every change rerender the component
  // const watchUsername = watch("username");
  // const watchUsernameAndEmail = watch(["username", "email"]);
  // const watchForm = watch();

  // This way it doesn't rerender the component
  // useEffect(() => {
  //   const subscription = watch((value) => {
  //     console.log(value);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const handleGetValues = () => {
    // console.log("Get values", getValues());
    // console.log("Get values", getValues("social"));
    console.log("Get values", getValues(["social", "username"]));
  };

  const handleSetValue = () => {
    setValue("username", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  return (
    <div>
      <h1>YouTube Form {renderCount / 2}</h1>
      {/* <h2>Watched value: {JSON.stringify(watchForm)}</h2> */}

      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          {...register("username", {
            required: "Username is required",
          })}
        />
        <p className="error">{errors.username?.message}</p>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          {...register("email", {
            validate: {
              notAdmin: (fieldValue) => {
                return (
                  fieldValue !== "admin@example.com" ||
                  "Enter a different email address"
                );
              },
              notBlackListed: (fieldValue) => {
                return (
                  !fieldValue.endsWith("baddomain.com") ||
                  "This domain is not supported"
                );
              },
              emailAvailable: async (fieldValue) => {
                const response = await fetch(
                  `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                );
                const data = await response.json();
                return data.length == 0 || "Email already exists";
              },
            },
          })}
        />
        <p className="error">{errors.email?.message}</p>

        <label htmlFor="channel">Channel</label>
        <input
          type="text"
          id="channel"
          {...register("channel", {
            required: {
              value: true,
              message: "Channel is required",
            },
          })}
        />
        <p className="error">{errors.channel?.message}</p>

        <label htmlFor="twitter">Twitter</label>
        <input
          type="text"
          id="twitter"
          {...register("social.twitter", {
            disabled: watch("channel") === "",
            required: "Enter twitter profile!",
          })}
        />
        <p className="error">{errors.social?.twitter?.message}</p>

        <label htmlFor="facebook">Facebook</label>
        <input type="text" id="facebook" {...register("social.facebook")} />
        <p className="error">{errors.social?.facebook?.message}</p>

        <label htmlFor="primary-phone">Primary phone number</label>
        <input type="text" id="primary-phone" {...register("phoneNumbers.0")} />
        <p className="error">{errors.phoneNumbers?.message}</p>

        <label htmlFor="secondary-phone">Secondary phone number</label>
        <input
          type="text"
          id="secondary-phone"
          {...register("phoneNumbers.1")}
        />
        <p className="error">{errors.social?.facebook?.message}</p>

        <div>
          <label>List of phone numbers</label>
          <div>
            {fields.map((field, index) => {
              return (
                <div className="form-control" key={field.id}>
                  <input
                    type="text"
                    {...register(`phNumbers.${index}.number` as const)}
                  />
                  {index > 0 && (
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
            <button type="button" onClick={() => append({ number: "" })}>
              Add phone number
            </button>
          </div>
        </div>

        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          {...register("age", {
            valueAsNumber: true,
            required: {
              value: true,
              message: "Age is required",
            },
          })}
        />
        <p className="error">{errors.age?.message}</p>

        <label htmlFor="dob">Date of birth</label>
        <input
          type="date"
          id="dob"
          {...register("dob", {
            valueAsDate: true,
            required: {
              value: true,
              message: "Date of birth is required",
            },
          })}
        />
        <p className="error">{errors.dob?.message}</p>

        <button disabled={!isDirty || !isValid || isSubmitting}>Submit</button>
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
        <button type="button" onClick={handleGetValues}>
          Get values
        </button>
        <button type="button" onClick={handleSetValue}>
          Set value
        </button>
        <button
          type="button"
          onClick={() => {
            trigger();
            trigger("social.facebook");
          }}
        >
          Validate
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
