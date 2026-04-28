export interface JikanImage {
  image_url: string | null;
  small_image_url: string | null;
  large_image_url: string | null;
}

export interface JikanTitle {
  type: string;
  title: string;
}

export interface JikanRelation {
  mal_id: number | null;
  type: string;
  name: string;
  url: string | null;
}

export interface JikanDateProp {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface JikanDateRange {
  from: string | null;
  to: string | null;
  prop: {
    from: JikanDateProp;
    to: JikanDateProp;
  };
  string: string | null;
}
