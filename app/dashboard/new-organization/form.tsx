"use client";

import { authClient } from "@/lib/auth/client";
import { useDebounce } from "@/lib/debounce";
import { AddressSuggestion, autocompleteAddress } from "@/lib/google/functions";
import { createOrganization } from "@/lib/organizations/functions";
import { slugify } from "@/lib/utils";
import {
  Fieldset,
  Description,
  TextField,
  Input,
  ErrorMessage,
  Spinner,
  Button,
  Label,
  InputGroup,
  SearchField,
  Dropdown,
  ListBox,
  ListBoxItem,
  cn,
  cardVariants,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useActionState, useEffect, useRef, useState } from "react";

export default function CreateOrganizationForm() {
  const [state, action, isLoading] = useActionState(createOrganization, {
    status: "default",
  });

  const { data: session } = authClient.useSession();

  const [slug, setSlug] = useState(state?.fieldValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);

  const [addressQuery, setAddressQuery] = useState(
    state.fieldValues?.addressText ?? ""
  );
  const [placeId, setPlaceId] = useState(state.fieldValues?.placeId ?? "");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(addressQuery, 300);

  const suppressNextSearch = useRef(false);

  useEffect(() => {
    if (suppressNextSearch.current) {
      suppressNextSearch.current = false;
      return;
    }

    if (!debouncedQuery || debouncedQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    let active = true;

    setIsSearching(true);

    autocompleteAddress(debouncedQuery)
      .then((res) => {
        if (active) setSuggestions(res);
      })
      .finally(() => {
        if (active) setIsSearching(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    if (state?.fieldValues?.addressText !== undefined) {
      setAddressQuery(state.fieldValues.addressText);
    }

    if (state?.fieldValues?.placeId !== undefined) {
      setPlaceId(state.fieldValues.placeId);
    }

    if (state?.fieldValues?.slug !== undefined) {
      setSlug(state.fieldValues.slug);
    }
  }, [state]);

  return (
    <form action={action} className="w-full max-w-sm flex flex-col gap-6">
      <Fieldset>
        <Fieldset.Legend>Create your SalonOS organization</Fieldset.Legend>
        <Description>What should we name your business?</Description>

        <TextField
          name="name"
          defaultValue={state?.fieldValues?.name}
          onChange={(e) => {
            if (!slugTouched) {
              setSlug(slugify(e));
            }
          }}
        >
          <Label>Business Name</Label>
          <Input placeholder="My Salon" />
          {state?.status === "error" && state.fieldErrors?.name && (
            <ErrorMessage>{state.fieldErrors?.name?.errors[0]}</ErrorMessage>
          )}
        </TextField>

        <TextField
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e);
          }}
        >
          <Label>Slug</Label>
          <InputGroup>
            <InputGroup.Prefix className="pr-0 text-base sm:text-sm">
              https://salonos.io/
            </InputGroup.Prefix>
            <InputGroup.Input placeholder="my-salon" />
          </InputGroup>
          {state?.status === "error" && state.fieldErrors?.slug && (
            <ErrorMessage>{state.fieldErrors?.slug?.errors[0]}</ErrorMessage>
          )}
        </TextField>

        <SearchField
          name="addressText"
          value={addressQuery}
          onChange={setAddressQuery}
        >
          <Label>Address</Label>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search your address" />
            <SearchField.ClearButton />
          </SearchField.Group>
          {suggestions.length > 0 && (
            <ListBox className="bg-surface rounded-3xl shadow-sm text-sm text-muted">
              {suggestions.map((s) => (
                <ListBoxItem
                  key={s.placeId}
                  onAction={() => {
                    suppressNextSearch.current = true;
                    setAddressQuery(s.text.text);
                    setPlaceId(s.placeId);
                    setSuggestions([]);
                  }}
                >
                  {s.text.text}
                </ListBoxItem>
              ))}
            </ListBox>
          )}
        </SearchField>

        <Input hidden name="userId" defaultValue={session?.user.id} />
        <Input
          hidden
          name="placeId"
          value={placeId}
          onChange={(e) => setPlaceId(e.target.value)}
        />
      </Fieldset>
      {state?.status === "error" && state.formErrors && (
        <ErrorMessage>{state.formErrors[0]}</ErrorMessage>
      )}
      <div className="flex gap-4">
        <Button type="submit">
          {isLoading ? "Creating..." : "Create"}
          {isLoading ? (
            <Spinner size="sm" color="current" />
          ) : (
            <Icon icon={"tabler:building-store"} />
          )}
        </Button>
      </div>
    </form>
  );
}
