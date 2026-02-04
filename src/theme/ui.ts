export const colors = {
  bg: "#0B1220",
  card: "#121A2B",
  border: "rgba(255,255,255,0.12)",
  text: "#EAF0FF",
  muted: "rgba(234,240,255,0.65)",
  primary: "#6EA8FE",
  danger: "#FF5C7A",
  success: "#42D392",
  warn: "#F7C948",
};

export const ui = {
  screen: { flex: 1, padding: 16 },

  title: { fontSize: 26, fontWeight: "900", color: colors.text },
  subtitle: { fontSize: 13, color: colors.muted },

  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    padding: 12,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: { color: "#0B1220", fontWeight: "900", fontSize: 16 },

  link: {
    color: colors.primary,
    textAlign: "center",
    marginTop: 12,
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  smallBtn: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
};
