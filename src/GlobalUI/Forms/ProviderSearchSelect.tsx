import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useField, useFormikContext } from "formik";
import React from "react";

// @ts-ignore
export const ProviderSearchSelect = ({ itemClick, getdata, loading, data, label, ...props }) => {
  const formikProps = useFormikContext();

  // @ts-ignore
  const [field, meta] = useField(props);

  const changeInput = (value: any) => {
    formikProps.setFieldValue(field.name, value);
  };
  return (
    <AutoComplete openOnFocus>
      <FormControl>
        <AutoCompleteInput
          {...field}
          placeholder={props.placeholder}
          onChange={(e: any) => getdata(e.target.value)}
          variant="filled"
        />
        <AutoCompleteList>
          {!loading && data ? (
            data.length > 0 ? (
              data.map((option: any, oid: any) => (
                <AutoCompleteItem
                  key={`option-${oid}`}
                  value={option}
                  label={option.PER_DNI + " - " + option.PER_NAME}
                  textTransform="capitalize"
                  // @ts-ignore
                  onClick={() => itemClick(option, changeInput)}
                >
                  <Box alignItems={'start'} textAlign={'start'}>
                    <Text fontSize="sm" fontWeight={'bold'}>
                      {option.PER_TRADENAME
                        ? option.PER_TRADENAME
                        : option.PER_NAME + " " + option.PER_LASTNAME}
                    </Text>
                    <Text fontSize="xs">
                      {option.PER_DNI
                        ? `DNI: ${option.PER_DNI}`
                        : `RUC:  ${option.PER_RUC}`}
                    </Text>
                  </Box>
                </AutoCompleteItem>
              ))
            ) : (
              <Skeleton height="35%" borderRadius="5px" />
            )
          ) : (
            <></>
          )}
        </AutoCompleteList>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    </AutoComplete>
  );
};

// @ts-ignore
export const ProductSearchSelect = ({ itemClick, setPro, pro, loading, data, label, ...props }) => {
  const formikProps = useFormikContext();

  // @ts-ignore
  const [field, meta] = useField(props);

  const changeInput = (value: any) => {
    formikProps.setFieldValue(field.name, value);
  };
  return (
    <AutoComplete openOnFocus>
      <FormControl>
        <AutoCompleteInput
          {...field}
          placeholder={props.placeholder}
          autoComplete={"off"}
          onChange={(e: any) => setPro(e.target.value)}
          onKeyUp={(e: any) => setPro(e.target.value)}
          value={pro}
          variant="filled"
        />
        <Box position={"fixed"} zIndex={"99"}>
          <AutoCompleteList>
            {!loading && data ? (
              data.length > 0 ? (
                data.map((option: any, oid: any) => (
                  <AutoCompleteItem
                    key={`option-${oid}`}
                    value={option}
                    label={option.PRO_NAME + " - " + option.PRO_CREATE_DATE}
                    textTransform="capitalize"
                    // @ts-ignore
                    onClick={() => itemClick(option, changeInput)}
                  >
                    <Flex>
                      <Image src={option.PRO_IMAGE} height={"50px"} />
                      <Box alignItems={'start'} textAlign={'start'}>
                        <Text fontSize="sm" fontWeight={'bold'}>
                          {option.PRO_BARCODE}
                        </Text>
                        <Text fontSize="xs">
                          {option.PRO_NAME + " " + option.PRO_CREATE_DATE}
                        </Text>
                      </Box>
                    </Flex>
                  </AutoCompleteItem>
                ))
              ) : (
                <Skeleton height="35%" borderRadius="5px" />
              )
            ) : (
              <></>
            )}
          </AutoCompleteList>
        </Box>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      </FormControl>
    </AutoComplete>
  );
};
